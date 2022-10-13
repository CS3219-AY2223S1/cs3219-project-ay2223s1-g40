import axios from "axios";
import { URL_USER_SVC_REFRESH_TOKEN } from "../configs";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export function jwtDecode(t) {
  let token = {};
  token.raw = t;
  token.header = JSON.parse(window.atob(t.split(".")[0]));
  token.payload = JSON.parse(window.atob(t.split(".")[1]));
  return token.payload;
}

export function refreshJwt() {
  const refresh_token = getCookie("refresh_token");
  if (!refresh_token) return;
  axios.post(
    URL_USER_SVC_REFRESH_TOKEN,
    { username: jwtDecode(refresh_token).username },
    {
      headers: {
        Authorization: "Bearer " + refresh_token,
      },
    }
  );
}
