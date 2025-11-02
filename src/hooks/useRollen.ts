import {useQuery} from '@tanstack/react-query'
import {getRollen} from "../services/dataService.ts"

export function useRollen() {
    const {isLoading, isError, data: rollen} = useQuery({queryKey: ['items'], queryFn: () => getRollen()})
    return {
        isLoading,
        isError,
        rollen,
    }
}
