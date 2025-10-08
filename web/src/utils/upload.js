import Compressor from "compressorjs";

const upload = {
  compress: (file) => {
    return new Promise((resolve, reject) => {
      console.log(file);
      new Compressor(file, {
        quality: 0.6,
        success(result) {
          console.log(result);
          resolve(result);
        },
        error(err) {
          reject(err);
        },
      });
    });
  },
};

export default upload;
