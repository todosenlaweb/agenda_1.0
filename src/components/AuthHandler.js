import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { getCookie, deleteCookie } from "../utils/cookies";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AuthHandler = () => {
  const { setUserRole } = useUser();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getCookie("token");
      

      if (!token) {
        setUserRole("guest");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}me?token=${token}`);
        
        if (!response.ok) {
          setUserRole("guest");
          throw new Error('Token inválido');
        }

        const data = await response.json();
        
        setUserRole(data.role);
      } catch (error) {
        
        console.error('Error al verificar token:', error);
        deleteCookie("token");
      }
    };

    checkAuth();
  }, [setUserRole]);

  return null;
};

export default AuthHandler;
