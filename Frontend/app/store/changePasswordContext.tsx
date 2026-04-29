import { createContext, useState, useContext } from "react";

interface changePasswordData {
  email?: string;
  password?: string;
}

interface ChangePasswordContextType {
  changePasswordData: changePasswordData;
  setChangePasswordData: React.Dispatch<React.SetStateAction<changePasswordData>>;
  resetChangePasswordData: () => void;
}

const ChangePasswordContext = createContext<ChangePasswordContextType | null>(null);

const ChangePasswordProvider = ({ children }: { children: React.ReactNode }) => {
  const [changePasswordData, setChangePasswordData] = useState<changePasswordData>({
    email: "",
    password: "",
  });

  const resetChangePasswordData = () => setChangePasswordData({ email: "", password: "" });
  return (
    <ChangePasswordContext.Provider value={{ changePasswordData, setChangePasswordData, resetChangePasswordData }}>
      {children}
    </ChangePasswordContext.Provider>
  );
};

export {ChangePasswordContext}
export default ChangePasswordProvider;