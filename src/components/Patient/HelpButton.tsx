import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import {useHulpVragenContext} from "../../hooks/usePatientContext.ts";

export const HelpButton = ({ patientId }: { patientId: number }) => {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setHulpNodig } = useHulpVragenContext();

    const handleClickOpen = () => {
        try {
            setHulpNodig(patientId, true);
            setOpen(true);
        } catch (err) {
            console.error("Failed to update hulpNodig status", err);
            setError("Failed to request help. Please try again.");
        }
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    return (
        <>
            <Button
                variant="outlined"
                fullWidth
                sx={{ textTransform: 'none', borderRadius: 1, py: 1 }}
                onClick={handleClickOpen}
            >
                Vraag om hulp
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Hulp Nodig?</DialogTitle>
                <DialogContent>
                    {error ? (
                        <div>{error}</div>
                    ) : (
                        "Iemand is onderweg om u te helpen."
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Sluiten
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};