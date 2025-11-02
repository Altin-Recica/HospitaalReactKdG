import {useQuery} from "@tanstack/react-query";
import {getMedicatie} from "../services/dataService.ts";

export function useMedicatie() {
    const {isLoading, isError, data: medicatie} = useQuery({queryKey: ['medicatie'], queryFn: () => getMedicatie()})
    return {
        isLoadingMedicatie: isLoading,
        isErrorMedicatie: isError,
        medicatie,
    }
}
