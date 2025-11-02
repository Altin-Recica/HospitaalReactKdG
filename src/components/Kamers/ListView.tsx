import {
    Box,
    Button,
    Card,
    CardContent, CardMedia,
    Container,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";
import {KamerWithPatient} from "../../services/dataService.ts";
import {useAuth} from "../../context/AuthContext.tsx";
import {usePatients} from "../../hooks/usePatients.ts";
import {useUpdatePatientInRoom} from "../../hooks/useKamers.ts";
import {useEffect, useState} from "react";
import Loader from "../Loader.tsx";
import {getUrgencyColor} from "../GetUrgencyColor.ts";
import {Patient} from "../../model/Patient.ts";
import {useHulpVragenContext} from "../../hooks/usePatientContext.ts";
import ErrorPage from "../ErrorPage.tsx";

export const ListView = ({kamers}: { kamers: KamerWithPatient[] }) => {
    const {gebruiker} = useAuth();
    const {patients, isLoading, isError, patientsNotInRoom, refetch} = usePatients();
    const {hulpVragen, setHulpNodig} = useHulpVragenContext();

    const {
        removePatientFromRoomMutation,
        isRemovingPatientFromRoom,
        isErrorRemovingPatientFromRoom,
        updatePatientMutation,
        isUpdatingPatient,
        isErrorUpdatingPatient,
    } = useUpdatePatientInRoom();

    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [patientDialogOpen, setPatientDialogOpen] = useState(false);
    const [selectedKamer, setSelectedKamer] = useState<KamerWithPatient | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<KamerWithPatient["patient"] | null>(null);

    useEffect(() => {
        refetch();
    }, [kamers, refetch]);

    if (isRemovingPatientFromRoom) return <Loader>We're removing patient from room...</Loader>;

    if (isErrorRemovingPatientFromRoom) {
        return <ErrorPage message="Oops, we were unable to remove patient from room." />
    }

    if (isLoading) return <Loader>We're loading patients...</Loader>;


    if (isError) {
        return <ErrorPage message="Oops, we were unable to load patients." />
    }

    if (isUpdatingPatient) return <Loader>We're updating patient...</Loader>;

    if (isErrorUpdatingPatient) {
        return <ErrorPage message="Oops, we were unable to update patient." />
    }


    const handleOpenAssignDialog = (kamer: KamerWithPatient) => {
        setSelectedKamer(kamer);
        setAssignDialogOpen(true);
    };

    const handleOpenPatientDialog = (kamer: KamerWithPatient) => {
        setSelectedKamer(kamer);
        setSelectedPatient(kamer.patient ?? null);
        setPatientDialogOpen(true);
    };

    const handleCloseAssignDialog = () => {
        setAssignDialogOpen(false);
        setSelectedKamer(null);
    };

    const handleClosePatientDialog = () => {
        setPatientDialogOpen(false);
        setSelectedPatient(null);
    };

    const handleRemovePatient = (kamerId: number) => {
        if (selectedKamer !== null) {
            removePatientFromRoomMutation(kamerId);
            handleClosePatientDialog();
        }
    };

    const handleAssignPatient = (patientId: number | null) => {
        if (selectedKamer !== null) {
            updatePatientMutation({kamerId: selectedKamer.id, patientId});
            handleCloseAssignDialog();
        }
    };

    const handleHelpProvided = async (patientId: number) => {
        setHulpNodig(patientId, false);
        handleClosePatientDialog();
    };

    return (
        <Container>
            <div className="mt-4">
                {kamers.length === 0 ? (
                    <ErrorPage message="Kamers could not be loaded" />
                ) : (
                    <div className="d-flex flex-wrap justify-content-center align-items-center">
                        {kamers.map((kamer) => {
                            let hulpNodig = false;
                            if (gebruiker?.role === 'Personeel' || gebruiker?.role === 'Arts') {
                                const patient = patients?.find((p: Patient) => p.id === kamer.patient?.id);
                                hulpNodig = patient?.hulpNodig || hulpVragen[kamer.patient?.id || 0];
                            }
                            return (
                                <Card
                                    key={kamer.id}
                                    className="role-card m-2 shadow-sm hover-shadow p-2"
                                    onClick={() => {
                                        if (gebruiker?.role === 'Personeel' || gebruiker?.role === 'Arts') {
                                            if (kamer.patient?.id !== undefined) {
                                                handleOpenPatientDialog(kamer);
                                            } else {
                                                handleOpenAssignDialog(kamer);
                                            }
                                        }
                                    }}
                                    sx={{
                                        border: hulpNodig ? "2px solid red" : "none",
                                    }}
                                >
                                    <CardContent sx={{margin: '0 auto'}}>
                                        <Typography variant="h5" align="center" className="mb-3">
                                            Kamer {kamer.kamernummer}
                                        </Typography>
                                        <CardMedia
                                            component="img"
                                            src={kamer.type === 'basis' ? '/basis.png' : '/luxe.png'}
                                            alt="kamer image"
                                            height="160"
                                            sx={{display: 'block', margin: '0 auto'}}
                                        />
                                        <Typography variant="h6" align="center">
                                            Kamer type: {kamer.type === 'basis' ? "Basis" : "Luxe"}
                                            <div
                                                className={kamer.status === 'Beschikbaar' ? 'text-success border border-success' : 'text-danger border border-danger'}
                                                style={{marginTop: 2}}
                                            >
                                                {kamer.status}
                                            </div>
                                        </Typography>

                                        {kamer.patient && (gebruiker?.role === 'Personeel' || gebruiker?.role === 'Arts') && (
                                            <>
                                                <Typography variant="body1" align="left" className="mt-2">
                                                    <div><h4>{kamer.patient.voornaam} {kamer.patient.naam}</h4></div>
                                                    <div>Geslacht: {kamer.patient.geslacht.toUpperCase()}</div>
                                                    <div>Voedingsvoorkeur: {kamer.patient.voorkeurVoeding}</div>
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        marginTop: 2,
                                                    }}
                                                >
                                                    <Box
                                                        key={kamer.id}
                                                        sx={{
                                                            display: 'inline-block',
                                                            border: `1px solid ${getUrgencyColor(kamer.patient?.medicatie || [])}`,
                                                            paddingLeft: 2,
                                                            paddingRight: 2
                                                        }}
                                                    >
                                                        Medicatie
                                                    </Box>
                                                </Box>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
            <Dialog open={assignDialogOpen} onClose={handleCloseAssignDialog}>
                <DialogTitle>Select a Patient to Assign</DialogTitle>
                <DialogContent>
                    <div>
                        {patientsNotInRoom && patientsNotInRoom.length > 0 ? (
                            patientsNotInRoom.map((patient) => (
                                <Button
                                    key={patient.id}
                                    onClick={() => handleAssignPatient(patient.id)}
                                    fullWidth
                                    variant="outlined"
                                    style={{margin: '5px 0'}}
                                >
                                    {patient.voornaam} {patient.naam}
                                </Button>
                            ))
                        ) : (
                            <Typography>No patients available.</Typography>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAssignDialog} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={patientDialogOpen} onClose={handleClosePatientDialog}>
                <DialogTitle>Patient Actions</DialogTitle>
                <DialogContent>
                    {selectedPatient ? (
                        <>
                            <Typography variant="h6">
                                Selected Patient: {selectedPatient.voornaam} {selectedPatient.naam}
                            </Typography>
                            <Typography variant="body1">Geslacht: {selectedPatient.geslacht.toUpperCase()}</Typography>
                            <Typography variant="body1">Voedingsvoorkeur: {selectedPatient.voorkeurVoeding}</Typography>
                        </>
                    ) : (
                        <Typography>No patient selected.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        if (selectedPatient) {
                            window.location.href = `/dossier/${selectedPatient.id}`;
                        }
                    }} variant="outlined" color="primary">
                        View Details
                    </Button>
                    <Button
                        onClick={() => {
                            if (selectedKamer && selectedKamer.id) {
                                handleRemovePatient(selectedKamer.id);
                            }
                        }}
                        variant="outlined"
                        color="error"
                    >
                        Remove Patient
                    </Button>
                    {hulpVragen[selectedKamer?.patient?.id || 0] && (
                        <Button
                            variant="outlined"
                            color="success"
                            onClick={() => handleHelpProvided(selectedKamer?.patient?.id ?? 0)}
                        >
                            Hulp Geboden
                        </Button>
                    )}
                    <Button onClick={handleClosePatientDialog} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};