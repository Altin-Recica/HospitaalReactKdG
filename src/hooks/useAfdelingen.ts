import {useQuery} from '@tanstack/react-query'
import {getAfdelingen} from "../services/dataService.ts"

export function useAfdelingen() {
    const {isLoading, isError, data: afdelingen} = useQuery({queryKey: ['items'], queryFn: () => getAfdelingen()})
    return {
        isLoading,
        isError,
        afdelingen,
    }
}
