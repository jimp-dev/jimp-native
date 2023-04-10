import { Image } from "@jimp/core";
import { throwError, isNodePattern, scan as originalScan } from "@jimp/utils";
import Jimp from "jimp";
import JimpNative from "./";

const scan: Jimp["scan"] = function (
  x: number,
  y: number,
  w: number,
  h: number,
  scanCallback: Parameters<Jimp["scan"]>[4],
  cb: Parameters<Jimp["scan"]>[5]
) {
  if (typeof x !== "number" || typeof y !== "number") {
    return throwError.call(this, "x and y must be numbers", cb);
  }

  if (typeof w !== "number" || typeof h !== "number") {
    return throwError.call(this, "w and h must be numbers", cb);
  }

  if (typeof scanCallback !== "function") {
    return throwError.call(this, "scanCallback must be a function", cb);
  }

  const result = originalScan(
    this as Image,
    x,
    y,
    w,
    h,
    scanCallback as unknown as Parameters<typeof originalScan>[5]
  );

  if (isNodePattern(cb)) {
    cb.call(this, null, result);
  }

  return result;
};

const clone: Jimp["clone"] = function (cb) {
  const clone = new this.constructor(this);
  cb?.call(clone, null, clone);
  return clone;
};

export function coreMethods(): Pick<
  Jimp,
  "scan" | "scanQuiet" | "clone" | "cloneQuiet"
> {
  return {
    scan,
    scanQuiet: scan,
    clone,
    cloneQuiet: clone,
  };
}
