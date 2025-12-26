"use client";

import React, { createContext, useContext, useState } from "react";
import axiosInstance from "./axiosinstance";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsAuthReady(true);
  }, []);

 const [loading, setLoading] = useState(false);

 const [error,setError] = useState(null);

  const SignUp = async({name,email,password}:any) => {
    try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.post("/user/signup",{name,email,password});
        const { result, token } = response.data;
        const userData = { ...result, token };
        setUser(userData);
        localStorage.setItem("user",JSON.stringify(userData));
        setLoading(false);
    } catch (error:any) {
        console.log(error);
        setError(error.response.data.message);
        setLoading(false);
        throw error;
    }
 }

 const Login = async({email,password}:any) => {
    try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.post("/user/login",{email,password});
        const { result, token } = response.data;
        const userData = { ...result, token };
        setUser(userData);
        localStorage.setItem("user",JSON.stringify(userData));
        setLoading(false);
    } catch (error:any) {
        console.log(error);
        setError(error.response.data.message);
        setLoading(false);
        throw error;
    }
 } 
 const Logout = () => {
    setUser(null);
    localStorage.removeItem("user");
 }
  const setCurrentUser = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, SignUp, Login, Logout, loading, error, isAuthReady, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
