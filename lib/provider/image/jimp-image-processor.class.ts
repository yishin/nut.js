import Jimp from "jimp";
import { Image } from "../../image.class";
import { Point } from "../../point.class";
import { ImageProcessor } from "../image-processor.interface";
import { imageToJimp } from "../io/imageToJimp.function";
import { RGBA } from "../../rgba.class";

export default class implements ImageProcessor {
  async colorAt(
    image: Image | Promise<Image>,
    point: Point | Promise<Point>
  ): Promise<RGBA> {
    const location = await point;
    const img = await image;
    if (location.x < 0 || location.x >= img.width) {
      throw Error(
        `Query location out of bounds. Should be in range 0 <= x < image.width, is ${location.x}`
      );
    }
    if (location.y < 0 || location.y >= img.height) {
      throw Error(
        `Query location out of bounds. Should be in range 0 <= y < image.height, is ${location.y}`
      );
    }
    const jimpImage = imageToJimp(img);
    const rgba = Jimp.intToRGBA(
      jimpImage.getPixelColor(location.x, location.y)
    );
    return new RGBA(rgba.r, rgba.g, rgba.b, rgba.a);
  }
}
