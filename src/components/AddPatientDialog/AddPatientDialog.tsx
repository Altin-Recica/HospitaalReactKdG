import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod';
import {Patient} from "../../model/Patient.ts";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";

const REQUIRED_FIELD_MESSAGE = 'This field is required';
const MIN_LENGTH_MESSAGE = (length: number) => `Please enter minimum ${length} characters.`;
const INVALID_FORMAT_MESSAGE = 'Invalid format';
const INVALID_DATE_MESSAGE = 'Invalid date';
const INVALID_GENDER_MESSAGE = 'Gender must be one of [m, v, x]';
const INVALID_DIET_MESSAGE = 'Diet preference must be one of [standaard, vegetarisch, suikervrij]';

const patientFields = [
    { name: 'voornaam', placeholder: 'Voornaam', required: true, minLength: 2 },
    { name: 'naam', placeholder: 'Achternaam', required: true, minLength: 2 },
    {
        name: 'rijksregisternummer',
        placeholder: 'Rijksregisternummer',
        required: true,
        pattern: /^\d{2}\.\d{2}\.\d{2}\.\d{3}\.\d{2}$/,
        errorMessage: INVALID_FORMAT_MESSAGE
    },
    {
        name: 'geboortedatum',
        placeholder: 'Geboortedatum',
        required: true,
        validateDate: true,
        errorMessage: INVALID_DATE_MESSAGE
    },
    {
        name: 'geslacht',
        placeholder: 'Geslacht',
        required: true,
        options: ['m', 'v', 'x'],
        errorMessage: INVALID_GENDER_MESSAGE
    },
    {
        name: 'voorkeurVoeding',
        placeholder: 'Voorkeur Voeding',
        required: true,
        options: ['standaard', 'vegetarisch', 'suikervrij'],
        errorMessage: INVALID_DIET_MESSAGE
    },
    {
        name: 'redenVanOpname',
        placeholder: 'Reden van Opname',
        required: true,
        minLength: 5
    },
    {
        name: 'opmerkingen',
        placeholder: 'Opmerkingen',
        required: false,
        maxLength: 200
    },
    {
        name: 'image',
        placeholder: 'Afbeelding',
        required: true
    }
];

const patientSchema = z.object({
    voornaam: z.string().min(2, MIN_LENGTH_MESSAGE(2)),
    naam: z.string().min(2, MIN_LENGTH_MESSAGE(2)),
    rijksregisternummer: z.string().regex(/^\d{2}\.\d{2}\.\d{2}\.\d{3}\.\d{2}$/, INVALID_FORMAT_MESSAGE),
    geboortedatum: z.string().transform((value) => {
        return new Date(value);
    }).refine((date) => !isNaN(date.getTime()), INVALID_DATE_MESSAGE),
    geslacht: z.enum(['m', 'v', 'x'], { errorMap: () => ({ message: INVALID_GENDER_MESSAGE }) }),
    voorkeurVoeding: z.enum(['standaard', 'vegetarisch', 'suikervrij'], { errorMap: () => ({ message: INVALID_DIET_MESSAGE }) }).optional(),
    redenVanOpname: z.string().min(5, MIN_LENGTH_MESSAGE(5)),
    opmerkingen: z.string().max(200).optional(),
    image: z.string().min(1, REQUIRED_FIELD_MESSAGE)
});

interface PatientDialogProps {
    isOpen: boolean;
    onSubmit: (data: Patient) => void;
    onClose: () => void;
}

export function AddPatientDialog({ isOpen, onSubmit, onClose }: PatientDialogProps) {
    const { control, handleSubmit, formState: { errors } } = useForm<Patient>({
        resolver: zodResolver(patientSchema), // Use zodResolver for form validation
        defaultValues: {
            voornaam: '',
            naam: '',
            rijksregisternummer: '',
            geboortedatum: new Date(),
            geslacht: 'm',
            voorkeurVoeding: [],
            redenVanOpname: '',
            opmerkingen: '',
            image: '',
        }
    });

    const onSubmitHandler = (data: Patient) => {
        onSubmit(data);
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmitHandler)} noValidate>
                <DialogTitle>Add Patient</DialogTitle>
                <DialogContent>
                    <DialogContentText>Enter details to create a new patient record</DialogContentText>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {patientFields.map((field, index) => (
                            <Controller
                                key={index}
                                name={field.name as keyof Patient}
                                control={control}
                                render={({ field: controllerField }) => (
                                    <TextField
                                        {...controllerField}
                                        placeholder={field.placeholder}
                                        type={field.name === 'geboortedatum' ? 'date' : 'text'}
                                        error={!!errors[field.name as keyof Patient]}
                                        helperText={errors[field.name as keyof Patient]?.message}
                                        required={field.required || false}
                                    />
                                )}
                            />
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions style={{ paddingRight: '1.5em', paddingBottom: '1.5em' }}>
                    <Button type="submit" variant="contained">
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