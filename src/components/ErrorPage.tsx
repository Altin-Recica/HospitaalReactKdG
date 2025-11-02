import React from 'react';
import Alert from '@mui/material/Alert';
import {Container} from "@mui/material";

interface ErrorPageProps {
    message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message = "Oops, something went wrong." }) => {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Alert severity="error" variant="filled">
                {message}
            </Alert>
        </Container>
    );
};

export default ErrorPage;
