import { useContext } from 'react';
import {HulpVragenContext} from "../context/HulpVragenContext.ts";

export const useHulpVragenContext = () => {
    const context = useContext(HulpVragenContext);
    if (!context) {
        throw new Error("useHulpVragenContext must be used within a HulpVragenContextProvider");
    }
    return context;
};