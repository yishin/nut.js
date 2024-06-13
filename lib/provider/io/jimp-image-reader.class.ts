import Jimp from "jimp";
import { ImageReader } from "../image-reader.type";
import { Image } from "../../image.class";
import { ColorMode } from "../../colormode.enum";

export default class implements ImageReader {
  load(parameters: string): Promise<Image> {
    return new Promise<Image>((resolve, reject) => {
      Jimp.read(parameters)
        .then((jimpImage) => {
          // stay consistent with images retrieved from libnut which uses BGR format
          jimpImage.scan(
            0,
            0,
            jimpImage.bitmap.width,
            jimpImage.bitmap.height,
            function (_, __, idx) {
              const red = this.bitmap.data[idx];
              this.bitmap.data[idx] = this.bitmap.data[idx + 2];
              this.bitmap.data[idx + 2] = red;
            }
          );
          resolve(
            new Image(
              jimpImage.bitmap.width,
              jimpImage.bitmap.height,
              jimpImage.bitmap.data,
              jimpImage.hasAlpha() ? 4 : 3,
              parameters,
              jimpImage.bitmap.data.length /
                (jimpImage.bitmap.width * jimpImage.bitmap.height),
              jimpImage.bitmap.data.length / jimpImage.bitmap.height,
              ColorMode.BGR
            )
          );
        })
        .catch((err) =>
          reject(`Failed to load image from '${parameters}'. Reason: ${err}`)
        );
    });
  }
}
