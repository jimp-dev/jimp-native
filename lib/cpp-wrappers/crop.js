const { throwError, isNodePattern } = require('@jimp/utils');
const Jimp = require('jimp');
const nativeAddon = require('../addon');
const { ensureInteger, isSynchronous, cppCallbackWrapper } = require('../util');

module.exports = {
    crop (x, y, w, h, cb) {
        try {
            x = Math.max(ensureInteger(x), 0);
            y = Math.max(ensureInteger(y), 0);
            w = Math.min(ensureInteger(w), this.getWidth());
            h = Math.min(ensureInteger(h), this.getHeight());

            const updateBitmap = () => {
                this.bitmap.data = this.bitmap.data.slice(0, w * h * 4);
                this.bitmap.width = w;
                this.bitmap.height = h;
            };

            const skip = (x === 0 && y === 0 && w === this.getWidth());
        
            // If X and Y is zero and w is the full image width then we can just cut the buffer to size.
            if (!skip) {
                nativeAddon.crop(
                    this.bitmap.data,
                    this.getWidth(),
                    this.getHeight(),
                    x,
                    y,
                    w,
                    h,
                    cppCallbackWrapper(this, typeof cb === 'function' ? (err) => {
                        if (err) {
                            return cb(err);
                        }

                        updateBitmap();

                        cb(null, this);
                    } : null)
                );
            } 
        
            if (isSynchronous(this, cb) || skip) {
                updateBitmap();
            }
        
            if(isNodePattern(cb) && (isSynchronous(this, cb) || skip)) {
                cb.call(this, null, this);
            }
        } catch (err) {
            return throwError.call(this, err, cb);
        }
        
        return this;
    },
    
    autocrop(...args) {
        let cb;
        let leaveBorder = 0;
        let tolerance = 0.0002;
        let cropOnlyFrames = true;
        let symmetric = false;

        let north = true;
        let east = true;
        let south = true;
        let west = true;

        for (const arg of args) {
            if (typeof arg === 'boolean') {
                cropOnlyFrames = arg;
            }

            if (typeof arg === 'number') {
                tolerance = arg;
            }

            if (typeof arg === 'function') {
                cb = arg;
            }

            if (typeof arg === 'object') {
                if (typeof arg.tolerance === 'number') {
                    tolerance = arg.tolerance;
                }

                if (typeof arg.cropOnlyFrames === 'boolean') {
                    cropOnlyFrames = arg.cropOnlyFrames;
                }

                if (typeof arg.cropSymmetric === 'boolean') {
                    symmetric = arg.cropSymmetric;
                }

                if (typeof arg.leaveBorder === 'number') {
                    leaveBorder = arg.leaveBorder;
                }

                if (typeof arg.ignoreSides === 'object') {
                    north = !arg.ignoreSides.north;
                    east = !arg.ignoreSides.east;
                    south = !arg.ignoreSides.south;
                    west = !arg.ignoreSides.west;
                }
            }
        }

        try {
            nativeAddon.autocrop(
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
                cppCallbackWrapper(this, typeof cb == 'function' ? (err, newWidth, newHeight, jimpInstance) => {
                    this.bitmap.width = newWidth;
                    this.bitmap.height = newHeight;
                    this.bitmap.data = this.bitmap.data.slice(0, this.bitmap.width * this.bitmap.height * 4);
                    cb(err, jimpInstance);
                }: null)
            );

            if (isSynchronous(this, cb)) {
                this.bitmap.data = this.bitmap.data.slice(0, this.bitmap.width * this.bitmap.height * 4);
            }
        } catch (err) {
            return throwError.call(this, err, cb);
        }

        if (isNodePattern(cb) && isSynchronous(this, cb)) {
            cb.call(this, null, this);
        }

        return this;
    }
};