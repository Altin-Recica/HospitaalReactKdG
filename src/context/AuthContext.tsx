import {createContext, FC, ReactNode, useContext, useEffect, useState} from 'react';
import {AuthContextType} from "../model/AuthContextType.ts";
import {Gebruiker} from "../model/Gebruiker.ts";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [gebruiker, setGebruiker] = useState<Gebruiker | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('gebruiker');
        if (storedUser) {
            setGebruiker(JSON.parse(storedUser));
        }
    }, []);

    const login = (username: string, role: string) => {
        const newGebruiker = { username, role };
        setGebruiker(newGebruiker);
        localStorage.setItem('gebruiker', JSON.stringify(newGebruiker));
    };

    const logout = () => {
        setGebruiker(null);
        localStorage.removeItem('gebruiker');
    };

    return (
        <AuthContext.Provider value={{ gebruiker, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};