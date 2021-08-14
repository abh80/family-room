export function checkRoomID(roomID) {
  return /^\d{12}$/.test(parseInt(roomID));
}
export function checkUserName(name) {
  return /^[a-zA-Z0-9_]{1,16}$/.test(name);
}

export const apiUrl = "http://192.168.1.34:3000/api/"; // change this to your own ip from`ipconfig`
export const wsUrl = apiUrl.replace("http", "ws").replace("api", "gateway");
