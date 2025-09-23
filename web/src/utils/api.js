import axios from "axios";
import config from "./config";

const api = {
  axiosCreate: () => {
    return new Promise((resolve, reject) => {
      axios.defaults.baseURL = config.server_ip;
      axios
        .get("/")
        .then((res) => {
          console.log(res);
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
};

export default api;
