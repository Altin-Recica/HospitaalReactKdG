import { Button, Card, CardMedia, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { usePatient } from "../../hooks/usePatients.ts";
import { HelpButton } from "../Patient/HelpButton.tsx";
import Loader from "../Loader.tsx";
import ErrorPage from "../ErrorPage.tsx";

export const Patient = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isLoading, isError, patient } = usePatient(id ? Number(id) : 0);

    if (isLoading) {
        return <Loader>Logging in as patient...</Loader>;
    }

    if (isError || !patient) {
        return <ErrorPage message="Login as patient failed" />
    }

    return (
        <>
            <Card
                sx={{
                    width: '100%',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    p: 3,
                }}
            >
                <Stack
                    spacing={3}
                    alignItems="center"
                    sx={{ maxWidth: 400, width: '100%', mt: 8 }}
                >
                    <CardMedia
                        component="img"
                        image={`/${patient?.image}`}
                        alt={`${patient?.voornaam} ${patient?.naam}`}
                        sx={{
                            width: 200,
                            height: 200,
                            borderRadius: "50%",
                            objectFit: "cover"
                        }}
                    />

                    <Typography variant="h4" component="h1">
                        {patient?.naam} {patient?.voornaam}
                    </Typography>

                    <Stack spacing={2} sx={{ width: '100%', maxWidth: 250 }}>
                        <HelpButton patientId={patient.id} />

                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                                textTransform: 'none',
                                borderRadius: 1,
                                py: 1,
                            }}
                            onClick={() => navigate(`/Dossier/${patient?.id}`)}
                        >
                            Naar mijn dossier
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                                textTransform: 'none',
                                borderRadius: 1,
                                py: 1,
                            }}
                            onClick={() => navigate('/afdelingen')}
                        >
                            Overzicht van het ziekenhuis
                        </Button>
                    </Stack>
                </Stack>
            </Card>
        </>
    );
};