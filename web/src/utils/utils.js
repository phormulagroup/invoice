import axios from "axios";
import config from "./config";

const utils = {
  generatePassword: () => {
    return new Promise((resolve, reject) => {
      resolve(Math.random().toString(36).slice(-8));
    });
  },
};

export default utils;
