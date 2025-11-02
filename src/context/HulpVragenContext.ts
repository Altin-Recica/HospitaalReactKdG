import { createContext } from 'react';

type HulpVragenContextType = {
    hulpVragen: { [patientId: number]: boolean };
    setHulpNodig: (patientId: number, hulpNodig: boolean) => void;
    refetchHulpVragen: () => void;
};

export const HulpVragenContext = createContext<HulpVragenContextType | undefined>(undefined);