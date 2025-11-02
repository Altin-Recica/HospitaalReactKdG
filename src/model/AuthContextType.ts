import {Gebruiker} from "./Gebruiker.ts";

export interface AuthContextType {
    gebruiker: Gebruiker | null;
    login: (gebruikersnaam: string, rol: string) => void;
    logout: () => void;
}
