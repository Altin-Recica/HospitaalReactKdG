import {Medicatie} from "./Medicatie.ts";

export type Gender = 'm' | 'v' | 'x';
export type DietPreference = 'standaard' | 'vegetarisch' | 'suikervrij';

export interface PatientMedicatie {
    medicatieid: number;
    hoeveelheid: number;
    time: string;
    reden: string;
    laatstEffectiefToegediend: string;
}

export interface Patient {
    id: number;
    voornaam: string;
    naam: string;
    rijksregisternummer: string;
    geboortedatum: Date;
    geslacht: Gender;
    voorkeurVoeding: DietPreference[];
    redenVanOpname: string;
    opmerkingen: string;
    image: string;
    medicatie: (PatientMedicatie & Medicatie)[];
    hulpNodig: boolean;
}

export type PatientData = Omit<Patient, "id">;