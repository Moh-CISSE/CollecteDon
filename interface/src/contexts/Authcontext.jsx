import React, { createContext, useContext, useState, useEffect } from "react";
import { defaultUser,defaultAuthContext } from "../types/Index";
import {
  apiLogin,
  apiRegister,
  apiGetProfile,
  apiUpdateProfile,
  apiCreateannonce,
  apiGetAnnonce,
  apireserverAnnonce,
  apimodifyAnnonce,
  apideleteAnnonce,
  apirecupereAnnonce,
  apiAnnulerreserverAnnonce,
  apiblockUser,
  apideleteUser,
  apideleteUserAnnonce,
  apigetAllUser
} from "../types/api";

export const AuthContext = createContext(defaultAuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(defaultUser);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      loadUser(storedToken);
    }
  }, []);

  const loadUser = async (jwt) => {
    const profile = await apiGetProfile(jwt);
    if (profile) setUser(profile);
  };

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    if (!data) return false;

    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return true;
  };

  const register = async (name, email, phone, password) => {
    const data = await apiRegister(name, email, phone, password);
    if (!data) return false;
    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(defaultUser);
  };

  const updateProfile = async (updates) => {
    if (!token) return false;
    const updated = await apiUpdateProfile(token, updates);
    if (updated) { 
      setUser(updated);
      return true;}
    return false;
  };
  const createannonce = async (newAnnonce) => {
    const response = await apiCreateannonce(token,newAnnonce);
    if (!response) return false;
    return true;
  };
const getAnnonce = async () => { 
  const response = await apiGetAnnonce();
  if (!response) return [];
  return response; 
};
const recupereAnnonce = async (id_annonce) => {
  const response = await apirecupereAnnonce(id_annonce);
  if (!response) return false;
  return true;
}
const reserverAnnonce = async (id_annonce) => {
const response = await apireserverAnnonce(id_annonce);
if (!response) return false;
return true;
}
const AnnulerreserverAnnonce= async (id_annonce) => {
const response = await apiAnnulerreserverAnnonce(id_annonce);
if (!response) return false;
return true;
}
const modifyAnnonce = async (annonces) =>{
  const response = await apimodifyAnnonce(annonces);
  if (!response) return false;
  return true;
}
const deleteMyannonce = async (id_annonce) =>{
  const response = await apideleteAnnonce(id_annonce);
  if (!response) return false;
  return true;
}
const getAllUsers = async () =>{
  const response = await apigetAllUser();
 if (!response) return [];
  return response; 
}
const deleteUserAnnonce = async (userId) =>{
     const response = await apideleteUserAnnonce(userId);
    if (!response) return false;
    return true;
} 

const deleteUser = async (userId) =>{
     const response = await apideleteUser(userId);
    if (!response) return false;
    return true;
} 

const blockUser = async (userId,val) =>{
     const response = await apiblockUser(userId,val);
    if (!response) return false;
    return true;
} 
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        createannonce,
        getAnnonce,
        reserverAnnonce,
        modifyAnnonce,
        deleteMyannonce,
        recupereAnnonce,
        AnnulerreserverAnnonce,
        getAllUsers,
        deleteUserAnnonce,
        deleteUser,
        blockUser,
      }}
    >

      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
