import CryptoJS from "crypto-js";

import Cookies from "js-cookie";

export const encryptFeature = (data) => {
  const jsonString = JSON.stringify(data);
  const secretKey = import.meta.env.VITE_SECRET_KEY;
  const encryptedData = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
  Cookies.set("MOC_Features", encryptedData);
  return encryptedData;
};

export const decryptFeature = () => {
  const encryptedDatas = Cookies.get("MOC_Features");
  const secretKey = import.meta.env.VITE_SECRET_KEY;
  if (encryptedDatas) {
    const bytes = CryptoJS.AES.decrypt(encryptedDatas, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } else {
    console.error("Failed to retrieve encrypted data from cookies.");
  }
};
