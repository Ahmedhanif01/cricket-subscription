import React from "react";
import { Globals } from "./constants";
import axios from "axios";
const CDN_URL = "https://asset.cricvids.co/";
const CDN_URL_ASSETS = CDN_URL + "cricwick-assets";

//Home
export const getCDNUrl = (filename) => {
  return CDN_URL_ASSETS + filename
}

export const getSubscriptionAPIURL = (appName, phone, sub_source = "") => {
    let url;
    switch (appName) {
      case "cricwick":
        url = "find_sub_tel_phone?phone=" + phone + "&source=2";
        url =
          sub_source.length > 0
            ? url + "&sub_source=" + sub_source
            : url + "&sub_source=" + Globals.appName;
        url = `${url}&app_name=${Globals.appName}`;
        break;
      case "mobilink":
        url = "find_sub_tel_phone?phone=" + phone + "&source=2";
        url =
          sub_source.length > 0
            ? url + "&sub_source=" + sub_source
            : url + "&sub_source=" + Globals.appName;
        url = `${url}&app_name=${Globals.appName}`;
        break;
      // case "mobilink":
      //   url = "send_pin?telco=mobilink&phone=" + phone + "&sub_type=1&source=2";
      //   url =
      //     sub_source.length > 0
      //       ? url + "&sub_source=" + sub_source
      //       : url + "&sub_source=" + Globals.appName;
      //   break;
      case "ufone":
        url = "send_pin?telco=ufone&phone=" + phone + "&sub_type=1&source=2";
        url =
          sub_source.length > 0
            ? url + "&sub_source=" + sub_source
            : url + "&sub_source=" + Globals.appName;
        break;
      case "zain":
        url = "send_pin?telco=zain&phone=" + phone + "&sub_type=1&source=2";
        url =
          sub_source.length > 0
            ? url + "&sub_source=" + sub_source
            : url + "&sub_source=" + Globals.appName;
        break;
      case "zong":
        url = "send_pin?telco=zong&phone=" + phone + "&sub_type=1&source=2";
        url =
          sub_source.length > 0
            ? url + "&sub_source=" + sub_source
            : url + "&sub_source=" + Globals.appName;
        break;
      default:
        url = "find_sub_tel_phone?phone=" + phone + "&source=2";
        url =
          sub_source.length > 0
            ? url + "&sub_source=" + sub_source
            : url + "&sub_source=" + Globals.appName;
        url = `${url}&app_name=${Globals.appName}`;
        break;
    }
    return url;
  };

  export const validatePhone = (phoneNumber, regexString) => {
    if (!phoneNumber) {
      return false;
    } else if (!regexString.test(phoneNumber)) {
      return false;
    } else {
      return true;
    }
  };

  export const internatonalizeNumber = (cc, telco, n) => {
    if (cc === "sa") {
      //**KSA**// 00966, 966, 05, 5
      if (n[0] === "5") {
        n = "966" + n;
      } else if (n[0] === "0" && n[1] === "5") {
        n = "966" + n.slice(1, n.length);
      } else if (n[0] === "9" && n[1] === "6" && n[2] === "6") {
        n = n;
      } else if (
        n[0] === "0" &&
        n[1] === "0" &&
        n[2] === "9" &&
        n[3] === "6" &&
        n[4] === "6"
      ) {
        n = n.slice(2, n.length);
      } else {
        n = "";
      }
    } else if (cc === "kw") {
      // Kuwait 965 only for zain
      if (telco === "zain_kw") {
        if (n[0] === "9" && n[1] !== "6") {
          n = "965" + n;
        } else if (n[0] === "0" && n[1] === "9") {
          n = "965" + n.slice(1, n.length);
        } else if (n[0] === "9" && n[1] === "6" && n[2] === "5") {
          n = n;
        } else if (
          n[0] === "0" &&
          n[1] === "0" &&
          n[2] === "9" &&
          n[3] === "6" &&
          n[4] === "5"
        ) {
          n = n.slice(2, n.length);
        } else {
          n = "";
        }
      }
    } else if (cc === "bh") {
      // Bahrain 973
      if (telco === "zain_bh") {
        if (n[0] === "9") {
          n = "973" + n;
        } else if (n[0] === "0" && n[1] === "9") {
          n = "973" + n.slice(1, n.length);
        } else if (n[0] === "9" && n[1] === "7" && n[2] === "3") {
          n = n;
        } else if (
          n[0] === "0" &&
          n[1] === "0" &&
          n[2] === "9" &&
          n[3] === "7" &&
          n[4] === "3"
        ) {
          n = n.slice(2, n.length);
        } else {
          n = "";
        }
      }
    } else if (cc === "qa") {
      // Qatar 974
      n = n[0] === "9" && n[1] === "7" && n[2] === "4" ? n : "";
    } else {
      // no handle cases for other telcos
      n = n;
    }
  
    return n;
  };