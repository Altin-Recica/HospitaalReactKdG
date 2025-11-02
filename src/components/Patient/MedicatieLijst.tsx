import {
    Box,
    Card,
    CardContent,
    Typography,
    Collapse,
    Button,
    List,
    ListItem,
    ListItemText, Stack, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import {usePatients} from "../../hooks/usePatients.ts";
import {addMedicationToPatient, markAsAdministered} from "../../services/dataService.ts";
import {useState} from "react";
import {useMedicatie} from "../../hooks/useMedicatie.ts";
import {PatientMedicatie} from "../../model/Patient.ts";
import {AddMedicationDialog} from "../AangevenMedicatieDialog";
import {useAuth} from "../../context/AuthContext.tsx";
import Loader from "../Loader.tsx";
import ErrorPage from "../ErrorPage.tsx";

export const MedicationList = () => {
    const {gebruiker} = useAuth();
    const {
        isLoading,
        isError,
        patients,
        refetch,
        removeMedicationMutation,
        isRemovingMedication,
        isErrorRemovingMedication
    } = usePatients();
    const {isLoadingMedicatie, isErrorMedicatie, medicatie} = useMedicatie();
    const [expandedPatientId, setExpandedPatientId] = useState<number | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [medicationToDelete, setMedicationToDelete] = useState<{
        patientId: number;
        medicationId: number;
        time?: string
    } | null>(null);

    const handleExpandClick = (patientId: number) => {
        setExpandedPatientId(expandedPatientId === patientId ? null : patientId);
    };

    const handleAddMedicationClick = (patientId: number) => {
        setSelectedPatientId(patientId);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedPatientId(null);
    };

    const handleDeleteClick = (patientId: number, medicationId: number, time?: string) => {
        setMedicationToDelete({patientId, medicationId, time});
        setConfirmDeleteOpen(true);
    };

    const confirmDeleteMedication = () => {
        if (medicationToDelete) {
            removeMedicationMutation(medicationToDelete);
            setConfirmDeleteOpen(false);
        }
    };

    const handleAddMedicationSubmit = async (data: PatientMedicatie) => {
        if (selectedPatientId !== null) {
            await addMedicationToPatient(selectedPatientId, data);
            await refetch();
            handleDialogClose();
        }
    };

    if (isLoadingMedicatie) return <Loader>Loading Medicatie...</Loader>;
    if (isErrorMedicatie || !medicatie) return <ErrorPage message="Error loading medicatie data" />;

    if (isLoading) return <Loader>Loading...</Loader>;
    if (isError || !patients) return <ErrorPage message="Error loading patient data" />;

    return (
        <>
            <Dialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
            >
                <DialogTitle>Bevestig Verwijderen</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Weet u zeker dat u deze medicatie wilt verwijderen?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)} color="primary" variant="outlined">
                        Annuleren
                    </Button>
                    <Button onClick={confirmDeleteMedication} color="error" variant="outlined">
                        Verwijderen
                    </Button>
                </DialogActions>
            </Dialog>

            <Box sx={{paddingTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography variant="h4">Medicatie</Typography>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', padding: 2}}>
                {patients.map((patient) => (
                    <Card key={patient.id} variant="outlined" sx={{marginBottom: 2}}>
                        <CardContent sx={{marginTop: 1}}>
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Typography variant="h6">
                                    {patient.voornaam} {patient.naam}
                                </Typography>
                                <Button
                                    onClick={() => handleExpandClick(patient.id)}
                                    variant="outlined"
                                    color="primary"
                                >
                                    {expandedPatientId === patient.id ? "Hide Medications" : "Show Medications"}
                                </Button>
                            </Box>
                        </CardContent>
                        <Collapse in={expandedPatientId === patient.id} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Typography variant="subtitle1">Medications</Typography>
                                <List>
                                    {patient.medicatie?.map((medicatie) => (
                                        <ListItem key={`${medicatie.medicatieid}-${medicatie.time}`}>
                                            <ListItemText
                                                primary={`${medicatie.naam} (${medicatie.vorm})`}
                                                secondary={`Amount: ${medicatie.hoeveelheid} mg - Reason: ${medicatie.reden} - Time: ${medicatie.time} - Last Administered: ${medicatie.laatstEffectiefToegediend || 'Not yet'}`}
                                            />
                                            <Stack
                                                direction={{xs: 'column', sm: 'row'}}
                                                spacing={1}
                                                sx={{marginLeft: 'auto'}}
                                            >
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => markAsAdministered(patient.id, medicatie.medicatieid)}
                                                >
                                                    Mark as Administered
                                                </Button>
                                                {gebruiker?.role === 'Arts' && (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleDeleteClick(patient.id, medicatie.medicatieid, medicatie.time)}
                                                        disabled={isRemovingMedication}
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </Stack>
                                        </ListItem>
                                    ))}
                                </List>
                                {isErrorRemovingMedication && (
                                    <Typography color="error">Error removing medication</Typography>
                                )}

                                {gebruiker?.role === 'Arts' && (
                                    <Box sx={{marginTop: 2, display: 'flex', justifyContent: 'center'}}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleAddMedicationClick(patient.id)}
                                        >
                                            Add Medication
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Collapse>
                    </Card>
                ))}
            </Box>
            <AddMedicationDialog
                isOpen={isDialogOpen}
                onSubmit={handleAddMedicationSubmit}
                onClose={handleDialogClose}
                medicationOptions={medicatie}
            />
        </>
    );
};