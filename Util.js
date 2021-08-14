export function checkRoomID(roomID) {
  return /^\d{12}$/.test(parseInt(roomID));
}
export function checkUserName(name) {
  
  return /^[a-zA-Z0-9 ]+$/.test(name);
}

export const apiUrl = "https://family-room-server.nospacex.repl.co/api/"; // change this to your own ip from`ipconfig`
export const wsUrl = apiUrl.replace("http", "ws").replace("api", "gateway");
