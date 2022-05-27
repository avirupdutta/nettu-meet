import { io } from "socket.io-client";
import { apiConfig } from "../../../config/api";

console.log(apiConfig);


export const signalingChannel = io(apiConfig.url, {
  path: "/nettu/api/v1/ws",
});
