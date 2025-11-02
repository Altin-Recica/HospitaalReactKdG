import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Kamer} from "../model/Kamer.ts";
import {getKamerVanAfdeling, updateRoom} from "../services/dataService.ts";


export function useKamersVanAfdeling(afdelingNaam: string) {
    const { isLoading, isError, data: kamers } = useQuery<Kamer[]>({
        queryKey: ['kamers', afdelingNaam],
        queryFn: () => getKamerVanAfdeling(afdelingNaam),
    });

    return {
        isLoading,
        isError,
        kamers,
    };
}

export function useUpdatePatientInRoom() {
    const queryClient = useQueryClient();

    const {
        mutate: updatePatientMutation,
        isPending: isUpdatingPatient,
        isError: isErrorUpdatingPatient,
    } = useMutation({
        mutationFn: (data: { kamerId: number | null; patientId: number | null }) =>
            updateRoom(data.kamerId, data.patientId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['kamers']});
        },
    });

    const {
        mutate: removePatientFromRoomMutation,
        isPending: isRemovingPatientFromRoom,
        isError: isErrorRemovingPatientFromRoom,
    } = useMutation({
        mutationFn: (kamerId: number) => updateRoom(kamerId, 0),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['kamers']});
        },
    });

    return {
        updatePatientMutation,
        isUpdatingPatient,
        isErrorUpdatingPatient,

        removePatientFromRoomMutation,
        isRemovingPatientFromRoom,
        isErrorRemovingPatientFromRoom,
    };
}