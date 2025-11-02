import axios from 'axios'
import {Rol} from "../model/Rol.ts"
import {Afdeling} from "../model/Afdeling.ts";
import {Kamer} from "../model/Kamer.ts";
import {Patient, PatientData, PatientMedicatie} from "../model/Patient.ts";
import {Medicatie} from "../model/Medicatie.ts";

export interface KamerWithPatient extends Kamer {
    patient?: Patient | null;
}

export async function getRollen() {
    const {data: rollen} = await axios.get<Rol[]>(`/roles`)
    return rollen
}

export async function getAfdelingen() {
    const {data: afdelingen} = await axios.get<Afdeling[]>(`/afdeling`)
    return afdelingen
}

export async function getKamerVanAfdeling(afdelingNaam: string): Promise<KamerWithPatient[]> {
    const {data: kamers} = await axios.get<Kamer[]>(`/kamers?afdelingNaam=${afdelingNaam}`);
    const {data: patients} = await axios.get<Patient[]>('/patients');

    return kamers.map(kamer => {
        const patient = patients.find(p => p.id === kamer.patientid);
        return {
            ...kamer,
            patient: patient ? {
                ...patient,
            } : null,
        };
    });
}

export async function getPatients() {
    const { data: patients } = await axios.get<Patient[]>('/patients');

    return await Promise.all(
        patients.map(async (patient) => {
            if (patient.medicatie) {
                patient.medicatie = await Promise.all(
                    patient.medicatie.map(async (med) => {
                        const { data: medicatieType } = await axios.get<Medicatie>(`/medicatie/${med.medicatieid}`);
                        return {
                            ...med,
                            id: medicatieType.id,
                            naam: medicatieType.naam,
                            vorm: medicatieType.vorm,
                        };
                    })
                );
            }
            return patient;
        })
    );
}


export async function getKamers() {
    const {data: kamers} = await axios.get<Kamer[]>(`/kamers`)
    return kamers
}

export async function getMedicatie() {
    const {data: medicatie} = await axios.get<Medicatie[]>(`/medicatie`)
    return medicatie
}

export async function getPatient(patientId: number): Promise<Patient & { medicatie: (PatientMedicatie & Medicatie)[] | null }> {
    const { data: patient } = await axios.get<Patient>(`/patients/${patientId}`);

    let medicatie: (PatientMedicatie & Medicatie)[] | null = null;
    if (patient.medicatie) {
        const medicationRequests = patient.medicatie.map(async (med) => {
            const { data: medicatieType } = await axios.get<Medicatie>(`/medicatie/${med.medicatieid}`);
            return {
                ...med,
                medicatieid: medicatieType.id,
                naam: medicatieType.naam,
                vorm: medicatieType.vorm,
            };
        });
        medicatie = await Promise.all(medicationRequests);
    }

    return {
        ...patient,
        medicatie: medicatie ?? [],
    };
}


export async function markAsAdministered(patientId: number, medicationId: number) {
    const currentTime = new Date().toISOString();

    const { data: patient } = await axios.get<Patient>(`/patients/${patientId}`);

    const updatedMedications = patient.medicatie.map(med =>
        med.medicatieid === medicationId
            ? { ...med, laatstEffectiefToegediend: currentTime }
            : med
    );

    await axios.put(`/patients/${patientId}`, {
        ...patient,
        medicatie: updatedMedications,
    });
}

export const addPatient = (item: PatientData) => {
    return axios.post('/patients', item)
};

export async function addMedicationToPatient(patientId: number, newMedication: PatientMedicatie) {
    const currentPatient = await getPatient(patientId);

    const exists = currentPatient.medicatie.some(
        (med) => med.medicatieid === newMedication.medicatieid && med.time === newMedication.time
    );

    if (!exists) {
        const updatedMedications = [
            ...(currentPatient.medicatie || []),
            newMedication,
        ];

        await axios.put(`/patients/${patientId}`, {
            ...currentPatient,
            medicatie: updatedMedications,
        });
    }
}

export async function removeMedicatie(patientId: number, medicationId: number, time?: string) {
    const { data: patient } = await axios.get<Patient>(`/patients/${patientId}`);

    const updatedMedications = patient.medicatie.filter(
        med => !(med.medicatieid === medicationId && (!time || med.time === time))
    );

    await axios.put(`/patients/${patientId}`, {
        ...patient,
        medicatie: updatedMedications,
    });
}



export const editPatient = (patientId: number, updatedData: PatientData) => {
    return axios.put(`/patients/${patientId}`, updatedData);
};

export const removePatient = async (patientId: number) => {
    const { data: kamer } = await axios.get(`/kamers?patientid=${patientId}`);

    if (kamer.length > 0) {
        await axios.put(`/kamers/${kamer[0].id}`, {
            ...kamer[0],
            status: 'Beschikbaar',
            patientid: 0,
        });
    }

    await axios.delete(`/patients/${patientId}`);
};

export const updateRoom = async (kamerId: number | null, patientId: number | null, needsHelp?: boolean) => {
    const { data: existingRoom } = await axios.get(`/kamers/${kamerId}`);

    const updatedRoom = {
        ...existingRoom,
        patientid: patientId,
        status: patientId === 0 ? 'Beschikbaar' : 'Bezet',
        patient: {
            ...existingRoom.patient,
            needsHelp: needsHelp ?? existingRoom.patient?.needsHelp,
        },
    };

    await axios.put(`/kamers/${kamerId}`, updatedRoom);
};

export const updateNeedsHelp = async (patientId: number, hulpNodig: boolean) => {
    const { data: currentPatient } = await axios.get(`/patients/${patientId}`);

    const updatedPatient = {
        ...currentPatient,
        hulpNodig: hulpNodig,
    };

    await axios.put(`/patients/${patientId}`, updatedPatient);
};

export const getHulpVragenStatuses = async () => {
    const response = await axios.get('/patients');
    const patients = response.data;

    return patients.reduce((acc: { [patientId: number]: boolean }, patient: { id: number; hulpNodig: boolean }) => {
        acc[patient.id] = patient.hulpNodig;
        return acc;
    }, {});
};