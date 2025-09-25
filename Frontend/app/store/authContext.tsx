import { createContext,useState } from "react";
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
    token: string;
    login: (tokenprop: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [token, setToken] = useState<string>('');

    const login = (tokenprop: string) => {
        setToken(tokenprop);
    }

    const logout = () => {
        setToken('');
    }

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
export { AuthContext };