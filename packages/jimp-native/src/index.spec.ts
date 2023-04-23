import Jimp from "./";

describe("coreMethods", () => {
  it("should have a working version of scan", () => {
    const image = new Jimp(16, 16);

    image.scan(0, 0, image.getWidth(), image.getHeight(), (x, y, idx) => {
      image.bitmap.data[idx] = idx / 4;
      image.bitmap.data[idx + 1] = idx / 4;
      image.bitmap.data[idx + 2] = idx / 4;
      image.bitmap.data[idx + 3] = idx / 4;
    });

    expect(image.bitmap.data[4]).toBe(1);
    expect(image.bitmap.data[255 * 4]).toBe(255);
  });

  it("scan should catch invalid X", () => {
    const image = new Jimp(16, 16);

    expect(() => {
      // eslint-disable-next-line no-useless-call
      image.scan.call(
        image,
        "bleep",
        0,
        image.getWidth(),
        image.getHeight(),
        () => {}
      );
    }).toThrow("x and y must be numbers");
  });

  it("scan should catch invalid Y", () => {
    const image = new Jimp(16, 16);

    expect(() => {
      // eslint-disable-next-line no-useless-call
      image.scan.call(
        image,
        0,
        "bleep",
        image.getWidth(),
        image.getHeight(),
        () => {}
      );
    }).toThrow("x and y must be numbers");
  });

  it("scan should catch invalid W", () => {
    const image = new Jimp(16, 16);

    expect(() => {
      // eslint-disable-next-line no-useless-call
      image.scan.call(image, 0, 0, "bleep", image.getHeight(), () => {});
    }).toThrow("w and h must be numbers");
  });

  it("scan should catch invalid H", () => {
    const image = new Jimp(16, 16);

    expect(() => {
      // eslint-disable-next-line no-useless-call
      image.scan.call(image, 0, 0, image.getWidth(), "bleep", () => {});
    }).toThrow("w and h must be numbers");
  });

  it("scan should catch invalid callback", () => {
    const image = new Jimp(16, 16);

    expect(() => {
      // eslint-disable-next-line no-useless-call
      image.scan.call(
        image,
        0,
        0,
        image.getWidth(),
        image.getHeight(),
        "bleep"
      );
    }).toThrow("scanCallback must be a function");
  });

  it("should have a working callback", (done) => {
    const image = new Jimp(16, 16);

    image.scan(
      0,
      0,
      image.getWidth(),
      image.getHeight(),
      (x, y, idx) => {
        image.bitmap.data[idx] = idx / 4;
        image.bitmap.data[idx + 1] = idx / 4;
        image.bitmap.data[idx + 2] = idx / 4;
        image.bitmap.data[idx + 3] = idx / 4;
      },
      done
    );
  });

  it("should have a working version of clone", () => {
    const image = new Jimp(16, 16);

    image.scan(0, 0, image.getWidth(), image.getHeight(), (x, y, idx) => {
      image.bitmap.data[idx] = idx / 4;
      image.bitmap.data[idx + 1] = idx / 4;
      image.bitmap.data[idx + 2] = idx / 4;
      image.bitmap.data[idx + 3] = idx / 4;
    });

    const clone = image.clone();

    expect(clone.bitmap.data[4]).toBe(1);
    expect(clone.bitmap.data[255 * 4]).toBe(255);
  });

  it("clone should also support a callback", (done) => {
    const image = new Jimp(16, 16);
    image.clone(done);
  });
});
