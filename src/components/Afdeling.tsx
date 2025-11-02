import {useAfdelingen} from "../hooks/useAfdelingen";
import Loader from "./Loader";
import {
    Card,
    CardContent,
    CardMedia,
    Container,
    Typography,
} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import ErrorPage from "./ErrorPage.tsx";

export const Afdeling = () => {
    const {isLoading, isError, afdelingen} = useAfdelingen();
    const navigate = useNavigate();

    const handleCardClick = (afdelingName: string) => {
        navigate(`/kamers/${afdelingName}`);
    };

    if (isLoading) {
        return <Loader>We're loading your afdelingen</Loader>;
    }

    if (isError || !afdelingen) {
        return <ErrorPage message="Afdelingen could not be loaded" />
    }

    return (
        <>
            <Container>
                <div className="mt-4 mb-4">
                    <Typography variant="h4" align="center" gutterBottom>
                        Ziekenhuisafdelingen
                    </Typography>
                </div>
                <div className="d-flex flex-wrap justify-content-center align-items-center">
                    {afdelingen.map((afdeling) => (
                        <Card
                            key={afdeling.name}
                            className="role-card m-2 shadow-sm hover-shadow p-3"
                            onClick={() => {
                                handleCardClick(afdeling.name);
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="160"
                                image={afdeling.image}
                                alt={afdeling.name}
                            />
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    {afdeling.name}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </Container>
        </>

    );
};
