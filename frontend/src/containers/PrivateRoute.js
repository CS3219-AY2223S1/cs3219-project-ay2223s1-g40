import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const [cookies] = useCookies(["refresh_token"]);
  return cookies["refresh_token"] ? children : <Navigate to="/login" />;
};
