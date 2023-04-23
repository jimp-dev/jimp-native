import { throwError } from "@jimp/utils";
import { Rotate } from "@jimp/plugin-rotate";
import { ImageCallback } from "@jimp/core";
import {
  ensureInteger,
  getAddonReleaseVersion,
  cppCallbackWrapper,
  AsyncPlugin,
  wrapAsync,
} from "@jimp-native/utils-ts";
import Jimp from "jimp";

const addon = require(`../build/${getAddonReleaseVersion()}/plugin-rotate-napi.node`);

type PluginRotate = AsyncPlugin<Rotate>;

function rotate(
  degrees: number,
  resize?: boolean | string | ImageCallback<PluginRotate>,
  cb?: ImageCallback<PluginRotate>
) {
  if (typeof resize === "undefined" || resize === undefined) {
    resize = true;
  }

  if (typeof resize === "function" && typeof cb === "undefined") {
    cb = resize;
    resize = true;
  }

  if (typeof resize !== "boolean" && typeof resize !== "string") {
    return throwError.call(
      this,
      "Resize must be of type Boolean or String",
      cb
    );
  }

  try {
    let { width, height } = this.bitmap;

    // Clone the current image data to a new Jimp instance.
    const originalImage = new this.constructor(0, 0) as Jimp;
    originalImage.bitmap = { ...this.bitmap };

    // If resize is not permitted, just go straight to advancedRotate in place
    if (!resize) {
      addon.advancedRotate(
        this.bitmap.data,
        this.bitmap.width,
        this.bitmap.height,
        degrees,
        cppCallbackWrapper(this, cb)
      );

      return this;
    }

    // If we can rotate by a multiple of 90 degrees, use a simplified matrix rotation method.
    if (degrees % 90 === 0) {
      // Ensure degrees is within a range C++ can work with.
      degrees %= 360;
      switch (degrees) {
        case 0:
          degrees = 0;
          break;
        case 90:
        case -270:
          degrees = 90;
          break;
        case 180:
        case -180:
          degrees = 180;
          break;
        default:
          degrees = 270;
      }

      if (degrees === 0) {
        if (cb) {
          cb.call(this, null, this);
        }

        return this;
      }

      const originalBitmap = this.bitmap.data;

      const newWidth = degrees % 180 === 0 ? width : height;
      const newHeight = degrees % 180 === 0 ? height : width;
      const newBuffer = Buffer.alloc(newWidth * newHeight * 4);

      this.bitmap.data = newBuffer;
      this.bitmap.width = newWidth;
      this.bitmap.height = newHeight;

      addon.matrixRotate(
        originalBitmap,
        width,
        height,
        newBuffer,
        newWidth,
        newHeight,
        degrees,
        cppCallbackWrapper(this, cb)
      );

      return this;
    }

    /**
     * No shortcuts left to try, calculate new size in JS, create an image of the right size and pass it onto
     * advancedRotate
     */
    const radians = (degrees * Math.PI) / 180;
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);

    width =
      Math.ceil(
        Math.abs(originalImage.getWidth() * cosine) +
          Math.abs(originalImage.getHeight() * sine)
      ) + 1;
    height =
      Math.ceil(
        Math.abs(originalImage.getWidth() * sine) +
          Math.abs(originalImage.getHeight() * cosine)
      ) + 1;

    if (width % 2 !== 0) {
      width++;
    }

    if (height % 2 !== 0) {
      height++;
    }

    const newWidthHeight = ensureInteger(
      Math.max(
        width,
        height,
        originalImage.getWidth(),
        originalImage.getHeight()
      )
    );

    this.bitmap.data = Buffer.alloc(newWidthHeight * newWidthHeight * 4);
    this.bitmap.width = newWidthHeight;
    this.bitmap.height = newWidthHeight;

    const self = this as Jimp;

    if (typeof self.crop !== "function") {
      return throwError.call(
        self,
        new Error(
          `A version of plugin-crop must be loaded in order to use resizing with rotate`
        ),
        cb
      );
    }

    if (typeof self.blit !== "function") {
      return throwError.call(
        self,
        new Error(
          `A version of plugin-blit must be loaded in order to use resizing with rotate`
        ),
        cb
      );
    }

    if (cb) {
      // If we're running in async mode then we'll need to chain these properly through callbacks.
      const doCrop = () => {
        self.crop(
          ensureInteger(self.bitmap.width / 2 - width / 2),
          ensureInteger(self.bitmap.height / 2 - height / 2),
          width,
          height,
          (err) => {
            if (err) {
              return throwError.call(self, err, cb);
            }

            cb.call(self, null, self);
          }
        );
      };

      const doRotate = () => {
        addon.advancedRotate(
          self.bitmap.data,
          self.bitmap.width,
          self.bitmap.height,
          degrees,
          (err) => {
            if (err) {
              return throwError.call(self, err, cb);
            }

            doCrop();
          }
        );
      };

      self.blit(
        originalImage,
        ensureInteger(self.bitmap.width / 2 - originalImage.getWidth() / 2),
        ensureInteger(self.bitmap.height / 2 - originalImage.getHeight() / 2),
        0,
        0,
        originalImage.getWidth(),
        originalImage.getHeight(),
        (err) => {
          if (err) {
            return throwError.call(self, err, cb);
          }

          doRotate();
        }
      );
    } else {
      self.blit(
        originalImage,
        ensureInteger(self.bitmap.width / 2 - originalImage.getWidth() / 2),
        ensureInteger(self.bitmap.height / 2 - originalImage.getHeight() / 2),
        0,
        0,
        originalImage.getWidth(),
        originalImage.getHeight()
      );

      addon.advancedRotate(
        self.bitmap.data,
        self.bitmap.width,
        self.bitmap.height,
        degrees
      );

      self.crop(
        ensureInteger(this.bitmap.width / 2 - width / 2),
        ensureInteger(this.bitmap.height / 2 - height / 2),
        width,
        height
      );
    }
  } catch (err) {
    return throwError.call(this, err, cb);
  }
}

const plugin: () => PluginRotate = () => ({
  rotate,
  rotateAsync: wrapAsync(rotate),
});

export default plugin;
