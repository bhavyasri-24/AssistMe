import { useState, useEffect } from "react";
import { AuthContext } from "./auth.context";
import { logoutAll, logoutUser } from "../features/auth/services/authService";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");

    if (storedUser && storedAccessToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccessToken);
    }

    setAuthReady(true);
  }, []);

  const login = (data) => {
    setUser(data.user);
    setAccessToken(data.accessToken);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("accessToken", data.accessToken);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    }
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  const logoutAllDevices = async () => {
    try {
      await logoutAll();
    } catch (error) {
      console.error(error);
    }
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  const updateUser = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem("user", JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        authReady,
        login,
        logout,
        logoutAllDevices,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
