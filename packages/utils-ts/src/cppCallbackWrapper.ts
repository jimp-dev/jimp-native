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

  return (error) => {
    jimpImage.bitmap.data = originalBitmap;

    if (typeof error === "string") {
      error = new Error(error);
    }

    userCallback.bind(jimpImage).call(jimpImage, error, jimpImage);
  };
};

/**
 * Creates a callback that can be used with addon code that either calls resolve or reject depending on the outcome.
 * Uses cppCallbackWrapper under the hood for thread safety and error handling.
 *
 * @param resolve
 * @param reject
 */
export const cppPromiseHandler = (
  jimpImage: Jimp,
  resolve: Function,
  reject: Function
) =>
  cppCallbackWrapper(jimpImage, (err, value) => {
    if (err) {
      return reject(err);
    }

    resolve(value);
  });

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
      callbackImplementation(...args, cppPromiseHandler(this, resolve, reject));
    });
  } as PromisifiedFunction<ImplementationT>;
