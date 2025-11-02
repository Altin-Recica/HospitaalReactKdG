import {useState, useCallback, useEffect} from 'react';
import { HulpVragenContext } from './HulpVragenContext';
import {getHulpVragenStatuses, updateNeedsHelp} from '../services/dataService';

export const HulpVragenContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [hulpVragen, setHulpVragen] = useState<{ [patientId: number]: boolean }>({});

    const fetchHulpVragenStatuses = async () => {
        try {
            const updatedHulpVragen = await getHulpVragenStatuses();
            setHulpVragen(updatedHulpVragen);
        } catch (error) {
            console.error("Failed to fetch hulpVragen statuses", error);
        }
    };

    const setHulpNodig = useCallback((patientId: number, hulpNodig: boolean) => {
        setHulpVragen((prev) => ({ ...prev, [patientId]: hulpNodig }));
        updateNeedsHelp(patientId, hulpNodig).catch((err) => {
            console.error("Failed to update backend hulpNodig status", err);
        });
    }, []);

    useEffect(() => {
        fetchHulpVragenStatuses();

        const interval = setInterval(() => {
            fetchHulpVragenStatuses();
        }, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <HulpVragenContext.Provider value={{ hulpVragen, setHulpNodig, refetchHulpVragen: fetchHulpVragenStatuses }}>
            {children}
        </HulpVragenContext.Provider>
    );
};