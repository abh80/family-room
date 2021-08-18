import * as cheerio from "react-native-cheerio";
import metaFields from "./fields";

export function checkRoomID(roomID) {
  return /^\d{12}$/.test(parseInt(roomID));
}
export function checkUserName(name) {
  return /^[a-zA-Z0-9 ]+$/.test(name);
}
// Remove before flight!!
export const apiUrl = "https://family-room-server.nospacex.repl.co/api/"; // change this to your own ip from`ipconfig`
// export const apiUrl = "http://192.168.1.34:3000/api/";
export const wsUrl = apiUrl.replace("http", "ws").replace("api", "gateway");

export const getOG = async (url) => {
  return fetch(url).then((res) => {
    return res.text().then((text) => {
      let ogObject = {};
      const $ = cheerio.load(text);
      $("meta").each((index, meta) => {
        if (!meta.attribs || (!meta.attribs.property && !meta.attribs.name))
          return;
        const property = meta.attribs.property || meta.attribs.name;
        const content = meta.attribs.content || meta.attribs.value;
        metaFields.forEach((item) => {
          if (property.toLowerCase() === item.property.toLowerCase()) {
            if (!item.multiple) {
              ogObject[item.fieldName] = content;
            } else if (!ogObject[item.fieldName]) {
              ogObject[item.fieldName] = [content];
            } else if (Array.isArray(ogObject[item.fieldName])) {
              ogObject[item.fieldName].push(content);
            }
          }
        });
      });
      return ogObject;
    });
  });
};
