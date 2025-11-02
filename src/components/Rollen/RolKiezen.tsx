import {Card, CardContent, CardMedia, Typography, Container, Box} from '@mui/material';
import {useRollen} from "../../hooks/useRollen.ts";
import Loader from "../Loader.tsx";
import {useAuth} from "../../context/AuthContext.tsx";
import ErrorPage from "../ErrorPage.tsx";

export const RolKiezen = () => {
    const {isLoading, isError, rollen} = useRollen()
    const {login} = useAuth();

    if (isLoading) {
        return <Loader>We're loading your roles</Loader>
    }

    if (isError || !rollen) {
        return <ErrorPage message="Roles could not be loaded" />
    }

    return (
        <Container>
            <div className={"mt-4 mb-4"}>
                <Typography variant="h2" align="center" gutterBottom>
                    Kies een rol
                </Typography>
            </div>

            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={2}
                sx={{"& > *": {flex: "1 1 200px", minHeight: 200}}}
            >
                {rollen.map((role) => (
                    <Card
                        key={role.title}
                        onClick={() => {
                            login(`Test gebruiker`, role.title);
                            window.location.href = role.ref;
                        }}
                        className="role-card m-2 shadow-sm hover-shadow p-3"
                    >
                        <CardMedia
                            component="img"
                            height="170"
                            image={role.image}
                            alt={role.title}
                            className="rolImage"
                        />
                        <CardContent>
                            <Typography variant="h6" align="center">
                                {role.title}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

        </Container>
    );
}