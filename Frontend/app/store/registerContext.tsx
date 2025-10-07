import { createContext, useState, useContext } from "react";

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
}

const RegisterContext = createContext<RegisterContextType | null>(null);

const RegisterProvider = ({ children }: { children: React.ReactNode }) => {
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const resetRegisterData = () => setRegisterData({ name: "", email: "", password: "", otp: "" });

  return (
    <RegisterContext.Provider value={{ registerData, setRegisterData, resetRegisterData }}>
      {children}
    </RegisterContext.Provider>
  );
};

export {RegisterContext}
export default RegisterProvider;