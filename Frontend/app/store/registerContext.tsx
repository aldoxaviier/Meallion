import { createContext, useState, useContext, useEffect } from "react";
import { setTokenGetter } from "../utils/api";
interface RegisterData {
  name: string;
  email: string;
  password: string;
  otp?: string;
}

interface RegisterContextType {
  registerData: RegisterData;
  setRegisterData: React.Dispatch<React.SetStateAction<RegisterData>>;
  resetRegisterData: () => void;
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

const RegisterContext = createContext<RegisterContextType | null>(null);

const RegisterProvider = ({ children }: { children: React.ReactNode }) => {
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const resetRegisterData = () => setRegisterData({ name: "", email: "", password: "", otp: "" });

  const setTokens = (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  useEffect(() => {
    setTokenGetter(() => accessToken);
  }, [accessToken]);

  return (
    <RegisterContext.Provider value={{ 
      registerData, 
      setRegisterData, 
      resetRegisterData,
      accessToken,
      refreshToken,
      setTokens
    }}>
      {children}
    </RegisterContext.Provider>
  );
};

export {RegisterContext}
export default RegisterProvider;