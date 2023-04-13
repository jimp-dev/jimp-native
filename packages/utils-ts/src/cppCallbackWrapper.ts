import { ImageCallback } from "@jimp/core";
import Jimp from "jimp";
import { PromisifiedFunction } from "./types/AsyncPlugin";

const bitmapDenyProxy = new Proxy(
  {},
  {
    get(target, prop) {
      throw new Error(
        `Attempted to access property "${String(
          prop
        )}" within bitmap data wile C++ thread is working on it.`
      );
    },
  }
);

/**
 * Wraps an image callback (if provided) with some additional logic that prevents other async functions form operating
 * on this jimp instance and passes C++ errors as proper error instances if C++ throws anything.
 *
 * @param jimpImage
 * @param userCallback
 */
export const cppCallbackWrapper = (
  jimpImage: Jimp,
  userCallback?: ImageCallback<any>
) => {
  if (!userCallback) {
    return null;
  }

  const originalBitmap = jimpImage.bitmap.data;

  jimpImage.bitmap.data = bitmapDenyProxy as unknown as Buffer;

  return (error, ...args) => {
    jimpImage.bitmap.data = originalBitmap;

    if (typeof error === "string") {
      error = new Error(error);
    }

    userCallback.bind(jimpImage).call(jimpImage, error, jimpImage, ...args);
  };
};

/**
 * Turns a callback-based image operation into an async one.
 *
 * @param callbackImplementation
 * @returns promisified implementation
 */
export const wrapAsync = <
  ImplementationT extends (...args: unknown[]) => unknown
>(
  callbackImplementation: ImplementationT
) =>
  function (...args) {
    return new Promise((resolve, reject) => {
      callbackImplementation.call(this, ...args, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result);
      });
    });
  } as PromisifiedFunction<ImplementationT>;
