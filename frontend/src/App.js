import Router from "./components/Router";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

import useUserStore from "./store/userStore";
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const zustandLogin = useUserStore((state) => state.login);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      const credentials = jwt_decode(token);
      const { _id, username } = credentials;
      zustandLogin(_id, username, token);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <></>;
  }
  return <Router />;
}

export default App;
