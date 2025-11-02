import SettingsContext from './SettingsContext'
import {useLocalStorage} from 'usehooks-ts'
import {ReactNode} from "react";

interface SettingsContextProviderProps {
    children: ReactNode
}

export default function SettingsContextProvider({ children }: SettingsContextProviderProps) {
    const [, setTheme] = useLocalStorage('theme', 'light');

    const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));

    return (
        <SettingsContext.Provider value={{ theme: true, toggleTheme }}>
            {children}
        </SettingsContext.Provider>
    );
}
