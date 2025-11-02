import {
    addMedicationToPatient,
    addPatient, editPatient,
    getKamers,
    getPatient,
    getPatients, removeMedicatie,
    removePatient,
} from "../services/dataService.ts";
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {PatientData, PatientMedicatie} from "../model/Patient.ts";

export function usePatients() {
    const queryClient = useQueryClient();

    const { isLoading: loadingPatients, isError: errorPatients, data: allPatients, refetch } = useQuery({
        queryKey: ['patients'],
        queryFn: () => getPatients(),
    });

    const { data: kamers } = useQuery({
        queryKey: ['kamers'],
        queryFn: getKamers,
    });

    const patientsNotInRoom = allPatients?.filter(patient =>
        !kamers?.some(kamer => kamer.patientid === patient.id)
    );

    const {
        mutate: addPatientMutation,
        isPending: isAddingPatient,
        isError: isErrorAddingPatient,
    } = useMutation({
        mutationFn: (patient: PatientData) => addPatient(patient),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
    });

    const {
        mutate: removePatientMutation,
        isPending: isRemovingPatient,
        isError: isErrorRemovingPatient,
    } = useMutation({
        mutationFn: (patientId: number) => removePatient(patientId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
    });

    const {
        mutate: editPatientMutation,
        isPending: isEditingPatient,
        isError: isErrorEditingPatient,
    } = useMutation({
        mutationFn: ({ patientId, updatedData }: { patientId: number; updatedData: PatientData }) =>
            editPatient(patientId, updatedData),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
    });

    const {
        mutate: addMedicationMutation,
        isPending: isAddingMedication,
        isError: isErrorAddingMedication,
    } = useMutation({
        mutationFn: ({ patientId, medicationData }: { patientId: number; medicationData: PatientMedicatie }) =>
            addMedicationToPatient(patientId, medicationData),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
    });

    const {
        mutate: removeMedicationMutation,
        isPending: isRemovingMedication,
        isError: isErrorRemovingMedication,
    } = useMutation({
        mutationFn: ({ patientId, medicationId, time }: { patientId: number; medicationId: number; time?: string }) =>
            removeMedicatie(patientId, medicationId, time),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
    });

    return {
        isLoading: loadingPatients,
        isError: errorPatients,
        patients: allPatients,
        patientsNotInRoom,
        addPatientMutation,
        isAddingPatient,
        isErrorAddingPatient,
        removePatientMutation,
        isRemovingPatient,
        isErrorRemovingPatient,
        editPatientMutation,
        isEditingPatient,
        isErrorEditingPatient,
        addMedicationMutation,
        isAddingMedication,
        isErrorAddingMedication,
        removeMedicationMutation,
        isRemovingMedication,
        isErrorRemovingMedication,
        refetch,
    };
}

export function usePatient(patientId: number) {
    const {isLoading, isError, data: patient} = useQuery({queryKey: ['patient'], queryFn: () => getPatient(patientId)})
    return {
        isLoading,
        isError,
        patient,
    }
}


