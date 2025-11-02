import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Autocomplete
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PatientMedicatie } from "../../model/Patient.ts";

const REQUIRED_FIELD_MESSAGE = 'This field is required';
const INVALID_DATETIME_MESSAGE = 'Invalid date/time format';

const medicationSchema = z.object({
    medicatieid: z.number().positive(REQUIRED_FIELD_MESSAGE),
    hoeveelheid: z.preprocess((val) => Number(val), z.number().positive(REQUIRED_FIELD_MESSAGE)),
    time: z.string().min(1, REQUIRED_FIELD_MESSAGE),
    reden: z.string().optional(),
    laatstEffectiefToegediend: z.string().optional().refine((value) => {
        return !value || !isNaN(new Date(value).getTime());
    }, INVALID_DATETIME_MESSAGE)
});

interface MedicationDialogProps {
    isOpen: boolean;
    onSubmit: (data: PatientMedicatie) => void;
    onClose: () => void;
    medicationOptions: { id: number; naam: string }[];
}

export function AddMedicationDialog({ isOpen, onSubmit, onClose, medicationOptions }: MedicationDialogProps) {
    const { control, formState: { errors }, getValues } = useForm<PatientMedicatie>({
        resolver: zodResolver(medicationSchema),
        defaultValues: {
            medicatieid: 0,
            hoeveelheid: 0,
            time: '',
            reden: '',
            laatstEffectiefToegediend: '',
        }
    });

    const onSubmitHandler = () => {
        const formData = getValues();
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <form noValidate>
                <DialogTitle>Add Medication</DialogTitle>
                <DialogContent>
                    <DialogContentText>Enter details to add medication for the patient</DialogContentText>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Controller
                            name="medicatieid"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
                                    options={medicationOptions}
                                    getOptionLabel={(option) => option.naam}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={medicationOptions.find((option) => option.id === field.value) || null}
                                    onChange={(_event, value) => field.onChange(value ? value.id : 0)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Type Medicatie"
                                            error={!!errors.medicatieid}
                                            helperText={errors.medicatieid?.message}
                                            required
                                        />
                                    )}
                                />
                            )}
                        />
                        <Controller
                            name="hoeveelheid"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    label="Hoeveelheid (milligram)"
                                    error={!!errors.hoeveelheid}
                                    helperText={errors.hoeveelheid?.message}
                                    required
                                />
                            )}
                        />
                        <Controller
                            name="time"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="time"
                                    label="Dagelijks Tijdstip van Toediening"
                                    error={!!errors.time}
                                    helperText={errors.time?.message}
                                    required
                                />
                            )}
                        />
                        <Controller
                            name="reden"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Reden"
                                    error={!!errors.reden}
                                    helperText={errors.reden?.message}
                                />
                            )}
                        />
                        <Controller
                            name="laatstEffectiefToegediend"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="datetime-local"
                                    label="Laatst Effectief Toegediend"
                                    error={!!errors.laatstEffectiefToegediend}
                                    helperText={errors.laatstEffectiefToegediend?.message}
                                />
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions style={{ paddingRight: '1.5em', paddingBottom: '1.5em' }}>
                    <Button
                        onClick={() => {
                            onSubmitHandler();
                        }}
                        variant="contained"
                    >
                        Add
                    </Button>
                    <Button variant="contained" onClick={onClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
