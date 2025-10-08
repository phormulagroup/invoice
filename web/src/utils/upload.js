import Compressor from "compressorjs";

const upload = {
  compress: (file) => {
    return new Promise((resolve, reject) => {
      console.log(file);
      if (file.type.includes("image/svg")) {
        resolve(file);
      } else {
        new Compressor(file, {
          quality: 0.6,
          success(result) {
            resolve(result);
          },
          error(err) {
            reject(err);
          },
        });
      }
    });
  },
};

export default upload;
