import {createContext, ReactNode, useContext} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {GlobalStyles} from "../components/GlobalStyles.tsx";
import { useLocalStorage } from 'usehooks-ts';

const defaultContextValue = {
    theme: 'light',
    toggleTheme: () => {},
};

const ThemeContext = createContext(defaultContextValue);

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useLocalStorage('theme', 'light');

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                <GlobalStyles theme={theme === 'light' ? lightTheme : darkTheme} />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);