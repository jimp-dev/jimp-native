import { throwError } from "@jimp/utils";
import { Crop } from "@jimp/plugin-crop";
import { ImageCallback } from "@jimp/core";
import {
  ensureInteger,
  getAddonReleaseVersion,
  cppCallbackWrapper,
  AsyncPlugin,
  wrapAsync,
} from "@jimp-native/utils-ts";

type CropPlugin = AsyncPlugin<Crop["class"]>;

const addon = require(`../build/${getAddonReleaseVersion()}/plugin-crop-napi.node`);

const crop = function (
  x: number,
  y: number,
  w: number,
  h: number,
  cb?: ImageCallback<CropPlugin>
) {
  const self = this;

  try {
    x = Math.max(ensureInteger(x), 0);
    y = Math.max(ensureInteger(y), 0);
    w = Math.min(ensureInteger(w), self.getWidth());
    h = Math.min(ensureInteger(h), self.getHeight());

    const updateBitmap = () => {
      self.bitmap.data = self.bitmap.data.slice(0, w * h * 4);
      self.bitmap.width = w;
      self.bitmap.height = h;
    };

    const skip = x === 0 && y === 0 && w === self.getWidth();

    if (skip) {
      // If X and Y is zero and w is the full image width then we can just cut the buffer to size.
      updateBitmap();

      if (typeof cb === "function") {
        cb.call(self, null, self);
      }

      return self;
    }

    const prependUpdate = typeof cb === "function";
    if (prependUpdate) {
      const originalCallback = cb;
      // Ensures updateBitmap gets called before the image gets to user code.
      cb = (err) => {
        if (err) {
          return throwError.call(self, err, cb);
        }

        updateBitmap();
        originalCallback.call(self, null, self);
      };
    }

    addon.crop(
      self.bitmap.data,
      self.getWidth(),
      self.getHeight(),
      x,
      y,
      w,
      h,
      cppCallbackWrapper(self, cb)
    );

    if (!prependUpdate) {
      updateBitmap();
    }

    return self;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const autocrop = function (
  arg1:
    | {
        tolerance?: number;
        cropOnlyFrames?: boolean;
        cropSymmetric?: boolean;
        leaveBorder?: number;
        ignoreSides?: {
          north: boolean;
          south: boolean;
          east: boolean;
          west: boolean;
        };
      }
    | number
    | boolean,
  arg2?: ImageCallback<CropPlugin> | boolean,
  arg3?: ImageCallback<CropPlugin>
) {
  let cb: ImageCallback<CropPlugin>;
  let leaveBorder = 0;
  let tolerance = 0.0002;
  let cropOnlyFrames = true;
  let symmetric = false;

  let north = true;
  let east = true;
  let south = true;
  let west = true;

  if (typeof arg1 === "object") {
    tolerance = arg1?.tolerance ?? tolerance;
    leaveBorder = arg1?.leaveBorder ?? leaveBorder;
    cropOnlyFrames = arg1?.cropOnlyFrames ?? cropOnlyFrames;
    symmetric = arg1?.cropSymmetric ?? symmetric;

    north = !arg1?.ignoreSides?.north;
    east = !arg1?.ignoreSides?.east;
    south = !arg1?.ignoreSides?.south;
    west = !arg1?.ignoreSides?.west;
  }

  if (typeof arg1 === "number") {
    tolerance = arg1;
  }

  if (typeof arg1 === "boolean") {
    cropOnlyFrames = arg1;
  }

  if (typeof arg2 === "boolean") {
    cropOnlyFrames = arg2;
  }

  if (typeof arg2 === "function") {
    cb = arg2;
  }

  if (typeof arg3 === "function") {
    cb = arg3;
  }

  const updateBitmap = () => {
    this.bitmap.data = this.bitmap.data.slice(
      0,
      this.bitmap.width * this.bitmap.height * 4
    );
  };

  const prependUpdate = typeof cb === "function";
  if (prependUpdate) {
    const originalCallback = cb;

    // Ensures updateBitmap gets called before the image gets to user code.
    cb = function (err) {
      if (err) {
        return originalCallback.call(this, err, null);
      }

      updateBitmap();
      originalCallback.call(this, null, this);
    };

    cb.bind(this);
  }

  try {
    addon.autocrop(
      this.bitmap.data,
      this.getWidth(),
      this.getHeight(),
      ensureInteger(leaveBorder),
      tolerance,
      cropOnlyFrames,
      symmetric,
      north,
      east,
      south,
      west,
      this.bitmap,
      cppCallbackWrapper(this, cb)
    );

    if (!prependUpdate) {
      updateBitmap();
    }

    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
};

const plugin: () => Omit<CropPlugin, "cropQuiet" | "cropQuietAsync"> = () => ({
  crop,
  cropAsync: wrapAsync(crop),
  autocrop,
  autocropAsync: wrapAsync(autocrop),
});

export default plugin;
