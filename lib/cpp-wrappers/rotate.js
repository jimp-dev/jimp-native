const { throwError, isNodePattern } = require('@jimp/utils');
const nativeAddon = require('../addon');
const { ensureInteger, isSynchronous, cppCallbackWrapper } = require('../util');

module.exports = {
    rotate (degrees, mode, cb) {
        if (typeof mode === 'undefined' || mode === null) {
            mode = true;
        }

        if (typeof mode === 'function' && typeof cb === 'undefined') {
            cb = mode;
            mode = true;
        }

        if (typeof mode !== 'boolean' && typeof mode !== 'string') {
            return throwError.call(this, 'Mode must be of type Boolean or String', cb);
        }

        try {
            let width = this.bitmap.width;
            let height = this.bitmap.height;

            const originalData = this.bitmap.data;
            const originalWidth = this.bitmap.width;
            const originalHeight = this.bitmap.height;

            if (mode) {
                /* Resizing behaviour can be done in JS without too much slowdown. Intensive operations such as blit are
                also covered in C++ land */
                const radians = (degrees * Math.PI) / 180;
                const cosine = Math.cos(radians);
                const sine = Math.sin(radians);

                width = Math.ceil(Math.abs(originalWidth * cosine) + Math.abs(originalHeight * sine)) + 1;
                height = Math.ceil(Math.abs(originalWidth * sine) + Math.abs(originalHeight * cosine)) + 1;

                if (width % 2 !== 0) {
                    width++;
                }

                if (height % 2 !== 0) {
                    height++;
                }

                const newWidthHeight = ensureInteger(Math.max(width, height, originalWidth, originalHeight));

                this.bitmap.data = Buffer.alloc(newWidthHeight * newWidthHeight * 4);
                this.bitmap.width = newWidthHeight;
                this.bitmap.height = newWidthHeight;

                if (isSynchronous(this, cb)) {
                    nativeAddon.blit(
                        originalData,
                        originalWidth,
                        originalHeight,
                        this.bitmap.data,
                        this.bitmap.width,
                        this.bitmap.height,
                        ensureInteger(this.bitmap.width / 2 - originalWidth / 2),
                        ensureInteger(this.bitmap.height / 2 - originalHeight / 2),
                        0,
                        0,
                        originalWidth,
                        originalHeight
                    );

                    nativeAddon.rotate(
                        this.bitmap.data,
                        this.bitmap.width,
                        this.bitmap.height,
                        degrees
                    );

                    nativeAddon.crop(
                        this.bitmap.data,
                        this.bitmap.width,
                        this.bitmap.height,
                        ensureInteger(this.bitmap.width / 2 - width / 2),
                        ensureInteger(this.bitmap.height / 2 - height / 2),
                        width,
                        height
                    );

                    this.bitmap.width = width;
                    this.bitmap.height = height;
                    this.bitmap.data = this.bitmap.data.slice(0, width * height * 4);
                } else {
                    // If we're running in async mode then we'll need to chain these properly through callbacks.
                    const doCrop = () => {
                        nativeAddon.crop(
                            this.bitmap.data,
                            this.bitmap.width,
                            this.bitmap.height,
                            ensureInteger(this.bitmap.width / 2 - width / 2),
                            ensureInteger(this.bitmap.height / 2 - height / 2),
                            width,
                            height,
                            cppCallbackWrapper(this, (err) => {
                                if (err) {
                                    return cb(err);
                                }

                                this.bitmap.width = width;
                                this.bitmap.height = height;
                                this.bitmap.data = this.bitmap.data.slice(0, width * height * 4);

                                cb(null, this);
                            })
                        );
                    };

                    const doRotate = () => {
                        nativeAddon.rotate(
                            this.bitmap.data,
                            this.bitmap.width,
                            this.bitmap.height,
                            degrees,
                            cppCallbackWrapper(this, (err) => {
                                if (err) {
                                    return cb(err);
                                }

                                doCrop();
                            })
                        );       
                    };

                    nativeAddon.blit(
                        originalData,
                        originalWidth,
                        originalHeight,
                        this.bitmap.data,
                        this.bitmap.width,
                        this.bitmap.height,
                        ensureInteger(this.bitmap.width / 2 - originalWidth / 2),
                        ensureInteger(this.bitmap.height / 2 - originalHeight / 2),
                        0,
                        0,
                        originalWidth,
                        originalHeight,
                        cppCallbackWrapper(this, (err) => {
                            if (err) {
                                return cb(err);
                            }
                            
                            doRotate();
                        })
                    );
                }
            } else {
                nativeAddon.rotate(
                    this.bitmap.data,
                    this.bitmap.width,
                    this.bitmap.height,
                    degrees,
                    cppCallbackWrapper(this, cb)
                );
            }     

            if (isNodePattern(cb) && isSynchronous(this, cb)) {
                cb.call(this, null, this);
            }
        } catch (err) {
            return throwError.call(this, err, cb);
        }

        return this;
    }
};
