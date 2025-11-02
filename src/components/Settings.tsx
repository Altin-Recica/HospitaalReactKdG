import {useTheme} from "../context/ThemeContext.tsx";
import {Card, CardContent, Typography, Box, Button} from '@mui/material';

const Settings = () => {
    const { toggleTheme } = useTheme();

    return (
        <div>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                className={"mt-5"}
            >
                <Card variant="outlined" style={{ width: '400px', padding: '20px' }}>
                    <CardContent>
                        <Typography variant="h3" component="div" align="center">
                            Settings
                        </Typography>
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: 1,
                                    py: 1,
                                }}
                                onClick={toggleTheme}>
                                Toggle Theme
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );

};

export default Settings;
