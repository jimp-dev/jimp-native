import Jimp from "jimp";

export enum EdgeHandling {
  EDGE_EXTEND = Jimp.EDGE_EXTEND,
  EDGE_WRAP = Jimp.EDGE_WRAP,
  EDGE_CROP = Jimp.EDGE_CROP,
}
