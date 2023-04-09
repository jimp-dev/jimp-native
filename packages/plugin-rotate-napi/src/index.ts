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
  if (typeof resize === "undefined" || resize === null) {
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

    if (resize) {
      /**
       * Resizing behaviour can be done in JS without too much slowdown. Intensive operations such as blit are also
       * covered in C++ land.
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
        const doCrop = function () {
          self.crop(
            ensureInteger(this.bitmap.width / 2 - width / 2),
            ensureInteger(this.bitmap.height / 2 - height / 2),
            width,
            height,
            (err) => {
              if (err) {
                return throwError.call(self, err, cb);
              }

              self.bitmap.width = width;
              self.bitmap.height = height;
              self.bitmap.data = this.bitmap.data.slice(0, width * height * 4);

              cb.call(self, this);
            }
          );
        };

        const doRotate = () => {
          addon.rotate(
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

        addon.rotate(
          this.bitmap.data,
          this.bitmap.width,
          this.bitmap.height,
          degrees
        );

        self.crop(
          ensureInteger(this.bitmap.width / 2 - width / 2),
          ensureInteger(this.bitmap.height / 2 - height / 2),
          width,
          height
        );

        this.bitmap.width = width;
        this.bitmap.height = height;
        this.bitmap.data = this.bitmap.data.slice(0, width * height * 4);
      }
    } else {
      addon.rotate(
        this.bitmap.data,
        this.bitmap.width,
        this.bitmap.height,
        degrees,
        cppCallbackWrapper(this, cb)
      );
    }

    return this;
  } catch (err) {
    return throwError.call(this, err, cb);
  }
}

const plugin: () => PluginRotate = () => ({
  rotate,
  rotateAsync: wrapAsync(rotate),
});

export default plugin;
