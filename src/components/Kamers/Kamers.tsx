import {useKamersVanAfdeling} from "../../hooks/useKamers.ts"; // Adjust the import path as necessary
import {Button, Container, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import '../../App.css';
import {useState} from "react";
import Loader from "../Loader.tsx";
import {ListView} from "./ListView.tsx";
import {PlanView} from "./PlanView.tsx";
import ErrorPage from "../ErrorPage.tsx";

export const Kamers = () => {
    const {afdelingNaam} = useParams();
    const {isLoading, isError, kamers} = useKamersVanAfdeling(afdelingNaam || '');
    const [viewMode, setViewMode] = useState('list');

    return (
        <>
            <Container>
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-6">
                        <Typography variant="h3" className="text-center flex-grow">
                            Kamers in {afdelingNaam}
                        </Typography>
                        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                            <Button
                                onClick={() => setViewMode('list')}
                                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                            >
                                List View
                            </Button>
                            <Button
                                onClick={() => setViewMode('plan')}
                                variant={viewMode === 'plan' ? 'contained' : 'outlined'}
                            >
                                Floor Plan
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <Loader>Loading rooms...</Loader>
                    ) : isError || !kamers ? (
                        <ErrorPage message="Rooms could not be loaded" />
                    ) : (
                        viewMode === 'list' ? <ListView kamers={kamers}/> : <PlanView kamers={kamers}/>
                    )}
                </div>
            </Container>
        </>

    );
};
