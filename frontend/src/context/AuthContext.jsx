import React, { createContext, useState, useEffect } from "react";
import { loginUser, getProfile } from "../services/authService";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const [loading, setLoading] = useState(true);

  // LOGIN
  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    const { token, user: userFromServer } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userFromServer));
    setUser(userFromServer);

    return res;
  };

  // REGISTER
  const register = async (formData) => {
    return await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
      method: "POST",
      body: formData
    }).then((r) => r.json());
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    getProfile()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
          setUser(JSON.parse(saved));
        } else {
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
