import { createContext } from 'react'

export interface ISettingsContext {
    theme: boolean
    toggleTheme: () => void
}

export default createContext<ISettingsContext>({
    theme: false,
    toggleTheme: () => {},
})
