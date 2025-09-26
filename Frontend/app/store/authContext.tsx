import { createContext,useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { useEffect } from "react";
import { attachTokenInterceptor } from "../utils/api";

interface AuthContextType {
    accessToken: string;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [accessToken, setAccessToken] = useState<string>('');

    useEffect(() => {
        attachTokenInterceptor(() => accessToken);
    }, [accessToken]);

    const login = async(accessToken: string, refreshToken: string) => {
        setAccessToken(accessToken);
        await SecureStore.setItemAsync('refreshToken', refreshToken);
    }

    const logout = async () => {
        setAccessToken('');
        await SecureStore.deleteItemAsync('refreshToken');
    }

    return (
        <AuthContext.Provider value={{ accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
export { AuthContext };