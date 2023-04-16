import Jimp from "jimp";
import configure from "@jimp/custom";
import types from "@jimp/types";
import plugins from "@jimp/plugins";
import path from "path";
import fs from "node:fs/promises";

type JimpLike = Pick<Jimp, "writeAsync" | "bitmap" | "getWidth" | "getHeight">;

export type BaseJimp = ReturnType<
  typeof configure<(typeof types)[], (typeof plugins)[]>
>;

export type TestFunction = <JimpCustom extends BaseJimp>(
  constructor: JimpCustom
) => Promise<JimpLike>;

const outputDir = path.join(process.cwd(), "test_output");

async function ensureOutputDirExists() {
  try {
    await fs.rm(outputDir, { recursive: true });
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }

  await fs.mkdir(outputDir);
}

beforeAll(async () => {
  await ensureOutputDirExists();
});

export const makeComparisonTest = <JimpCustom extends BaseJimp>(
  testName: string,
  otherConstructor: JimpCustom,
  otherConstructorName: string,
  testFunction: TestFunction,
  maxTolerance: number = 1
) => {
  it(`should pass comparison test: ${testName} | ±${maxTolerance} | original vs. ${otherConstructorName}`, async () => {
    const originalResult = await testFunction(Jimp as BaseJimp);

    const testNameInFile = testName.replace(/ /g, "_");

    await originalResult.writeAsync(
      path.join(outputDir, `${testNameInFile}__original.png`)
    );

    const otherResult = await testFunction<JimpCustom>(otherConstructor);

    await otherResult.writeAsync(
      path.join(outputDir, `${testNameInFile}__${otherConstructorName}.png`)
    );

    expect(originalResult.getWidth()).toEqual(otherResult.getWidth());
    expect(originalResult.getHeight()).toEqual(otherResult.getHeight());

    const {
      bitmap: { data: originalBuffer },
    } = originalResult;

    const {
      bitmap: { data: otherBuffer },
    } = otherResult;

    expect(originalResult.bitmap.data.byteLength).toEqual(
      otherResult.bitmap.data.byteLength
    );

    const components = ["R", "G", "B", "A"];

    for (let i = 0; originalBuffer.byteLength > i; i++) {
      const diff = Math.abs(originalBuffer[i] - otherBuffer[i]);

      if (maxTolerance >= diff) {
        continue;
      }

      throw new Error(
        `Exceeded max permitted tolerance of ${maxTolerance}. Byte index: ${i} Component: ${
          components[i % 4]
        }, Original byte: ${originalBuffer[i]} Other byte: ${otherBuffer[i]}`
      );
    }
  });
};
