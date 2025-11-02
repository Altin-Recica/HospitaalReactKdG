import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia, Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from "@mui/material";
import {usePatients} from "../../hooks/usePatients.ts";
import { Add as AddIcon, Delete as DeleteIcon, Info as InfoIcon, Edit as EditIcon } from '@mui/icons-material';
import {Patient, PatientData} from "../../model/Patient.ts";
import Loader from "../Loader.tsx";
import {AddPatientDialog} from "../AddPatientDialog";
import {useState} from "react";
import {EditPatientDialog} from "../EditPatientDialog";
import ErrorPage from "../ErrorPage.tsx";

export const Patienten = () => {
    const {
        isLoading, isError, patients, addPatientMutation, isAddingPatient, isErrorAddingPatient,
        removePatientMutation, isRemovingPatient, isErrorRemovingPatient, editPatientMutation,
        isErrorEditingPatient, isEditingPatient
    } = usePatients();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [patientToDelete, setPatientToDelete] = useState<number | null>(null);

    const addPatient = (data: PatientData) => {
        addPatientMutation({ ...data });
    };

    const editPatient = (data: PatientData) => {
        if (selectedPatient) {
            editPatientMutation({ patientId: selectedPatient.id, updatedData: data });
            setIsEditDialogOpen(false);
        }
    };

    const handleDeleteClick = (patientId: number) => {
        setPatientToDelete(patientId);
        setConfirmDeleteOpen(true);
    };

    const confirmDeletePatient = () => {
        if (patientToDelete !== null) {
            removePatientMutation(patientToDelete);
            setConfirmDeleteOpen(false);
        }
    };

    if (isLoading) return <Loader>Loading patients...</Loader>;
    if (isAddingPatient) return <Loader>We're creating your item</Loader>;

    if (isEditingPatient) {
        return <Loader>Editing patient...</Loader>;
    }

    if (isErrorAddingPatient) {
        return <ErrorPage message="Oops, we were unable to create your item." />
    }

    if (isRemovingPatient) {
        return <Loader>Removing patient...</Loader>;
    }

    if (isErrorEditingPatient) {
        return <ErrorPage message="Oops, we were unable to edit the patient." />
    }

    if (isErrorRemovingPatient) {
        return <ErrorPage message="Oops, we were unable to remove the patient." />
    }

    if (isError || !patients) {
        return <ErrorPage message="Oops, something went wrong." />
    }

    return (
        <>
            <AddPatientDialog
                isOpen={isDialogOpen}
                onSubmit={addPatient}
                onClose={() => setIsDialogOpen(false)}
            />
            {selectedPatient && (
                <EditPatientDialog
                    isOpen={isEditDialogOpen}
                    patientData={selectedPatient}
                    onSubmit={(item) => {
                        editPatient(item);
                        setSelectedPatient(null);
                    }}
                    onClose={() => {
                        setIsEditDialogOpen(false);
                        setSelectedPatient(null);
                    }}
                />
            )}
            <Dialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
            >
                <DialogTitle>Bevestig Verwijderen</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Weet u zeker dat u deze patiënt wilt verwijderen?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)} color="primary" variant="outlined">
                        Annuleren
                    </Button>
                    <Button onClick={confirmDeletePatient} color="error" variant="outlined">
                        Verwijderen
                    </Button>
                </DialogActions>
            </Dialog>

            <Box className="container mt-4">
                <Typography variant="h3" align="center" className="mb-3">
                    Patienten
                </Typography>
                {patients?.map((patient: Patient) => (
                    <Card key={patient.id} className="mb-3 w-100">
                        <Box className="row g-0">
                            <Box className="col-md-2 d-flex align-items-center justify-content-center">
                                <CardMedia
                                    component="img"
                                    image={patient.image}
                                    alt={`${patient.voornaam} ${patient.naam}`}
                                    sx={{
                                        width: "140px",
                                        height: "140px",
                                        objectFit: "cover",
                                    }}
                                />
                            </Box>
                            <Box className="col-md-6 pt-3">
                                <CardContent>
                                    <Typography variant="h5">{patient.voornaam} {patient.naam}</Typography>
                                    <Typography variant="body1">Geslacht: {patient.geslacht}</Typography>
                                    <Typography variant="body1">Voorkeur Voeding: {patient.voorkeurVoeding}</Typography>
                                </CardContent>
                            </Box>
                            <Box className="col-md-4 d-flex flex-md-column flex-row align-items-center justify-content-center gap-2 p-2">
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                    onClick={() => {
                                        setSelectedPatient(patient);
                                        setIsEditDialogOpen(true);
                                    }}
                                    className="m-1"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<InfoIcon />}
                                    onClick={() => window.location.href = `/dossier/${patient.id}`}
                                    className="m-1"
                                >
                                    Dossier
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDeleteClick(patient.id)}
                                    sx={{ marginLeft: '10px', marginRight: '30px', height: '40px' }}
                                >
                                    Verwijderen
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                ))}
                <Box display="flex" justifyContent="center" className="mt-3">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setIsDialogOpen(true)}
                        startIcon={<AddIcon />}
                        sx={{ marginBottom: 2 }}
                    >
                        Patient Toevoegen
                    </Button>
                </Box>
            </Box>
        </>
    );
};