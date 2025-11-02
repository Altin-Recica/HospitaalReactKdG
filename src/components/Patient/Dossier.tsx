import {useParams} from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Paper,
    Box,
    Stack
} from '@mui/material';
import {format} from 'date-fns';
import {usePatient} from "../../hooks/usePatients.ts";
import {DietPreference, Gender} from "../../model/Patient.ts";
import {useAuth} from "../../context/AuthContext.tsx";
import ErrorPage from "../ErrorPage.tsx";
import Loader from "../Loader.tsx";

export const Dossier = () => {
    const {gebruiker} = useAuth();
    const {id} = useParams();
    const {isLoading, isError, patient} = usePatient(id ? Number(id) : 0);

    if (isLoading) {
        return <Loader>Loading patient data...</Loader>
    }

    if (isError) {
        return <ErrorPage message="Er is een fout opgetreden bij het ophalen van de patiëntgegevens." />
    }


    type DataRowValue = string | number | Date | undefined | null | Gender | DietPreference[];
    const DataRow = ({label, value}: { label: string; value: DataRowValue }) => (
        <Stack direction="row" spacing={2} sx={{py: 0.5}}>
            <Typography variant="subtitle2" sx={{width: '40%'}}>
                {label}:
            </Typography>
            <Typography sx={{width: '40%'}}>
                {(() => {
                    if (value === undefined) {
                        return 'N/A';
                    }
                    return String(value);
                })()}
            </Typography>
        </Stack>
    );

    return (
        <>
            <Box sx={{p: 3, maxWidth: 800, mx: 'auto'}}>
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                            {gebruiker?.role === 'Personeel' || gebruiker?.role === 'Arts' ? (
                                `Dossier van ${patient?.naam}`
                            ) : (
                                'Mijn Dossier'
                            )}
                        </Typography>

                        <Stack direction={{xs: 'column', md: 'row'}} spacing={3}>
                            <Box flex={1}>
                                <Paper sx={{p: 3}}>
                                    <Typography variant="h6" gutterBottom>
                                        Gegevens
                                    </Typography>

                                    <Stack spacing={1}>
                                        <DataRow
                                            label="Voornaam"
                                            value={patient?.voornaam}
                                        />
                                        <DataRow
                                            label="Naam"
                                            value={patient?.naam}
                                        />
                                        <DataRow
                                            label="Geslacht"
                                            value={patient?.geslacht.toUpperCase()}
                                        />
                                        <DataRow
                                            label="Rijksregisternummer"
                                            value={patient?.rijksregisternummer}
                                        />
                                        <DataRow
                                            label="Geboortedatum"
                                            value={patient?.geboortedatum ? format(new Date(patient.geboortedatum), 'dd/MM/yyyy') : ''}
                                        />
                                        <DataRow
                                            label="Voorkeur voeding"
                                            value={patient?.voorkeurVoeding}
                                        />
                                        <DataRow
                                            label="Reden van opname"
                                            value={patient?.redenVanOpname}
                                        />
                                    </Stack>
                                </Paper>
                            </Box>

                            <Box flex={1}>
                                <Stack spacing={3}>
                                    <Paper sx={{p: 3}}>
                                        <Typography variant="h6" gutterBottom>
                                            Opmerkingen
                                        </Typography>
                                        <Typography variant="body2" sx={{whiteSpace: 'pre-wrap'}}>
                                            {patient?.opmerkingen || 'Geen opmerkingen'}
                                        </Typography>
                                    </Paper>

                                    <Paper sx={{ p: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Medicatie
                                        </Typography>
                                        {patient?.medicatie && patient.medicatie.length > 0 ? (
                                            patient.medicatie.map((medicatie, index) => (
                                                <Paper key={index} sx={{ p: 1 }}>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Medicatie {index + 1}
                                                    </Typography>
                                                    <Typography variant="body2">Naam: {medicatie.naam}</Typography>
                                                    <Typography variant="body2">Vorm: {medicatie.vorm}</Typography>
                                                    <Typography variant="body2">Hoeveelheid: {medicatie.hoeveelheid}</Typography>
                                                    <Typography variant="body2">Tijd: {medicatie.time}</Typography>
                                                    <Typography variant="body2">Reden: {medicatie.reden}</Typography>
                                                    <Typography variant="body2">
                                                        Laatst toegediend:
                                                        {medicatie.laatstEffectiefToegediend ? format(new Date(medicatie.laatstEffectiefToegediend), 'dd/MM/yyyy HH:mm:ss') : 'N/A'}
                                                    </Typography>
                                                </Paper>
                                            ))
                                        ) : (
                                            <Typography variant="body2">Geen medicatie</Typography>
                                        )}
                                    </Paper>
                                </Stack>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};