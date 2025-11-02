import {useAuth} from "../context/AuthContext.tsx";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Menu,
    MenuItem,
    IconButton, Button
} from '@mui/material';
import {useState} from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {useNavigate} from 'react-router-dom';

export const Navbar = () => {
    const {gebruiker, logout} = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleBack = () => {
        navigate(-1);
    };

    const patientImageSrc = gebruiker?.role
        ? `/${gebruiker.role.toLowerCase()}.png`
        : '/default.png';

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        handleClose();
    };

    const handleSettings = () => {
        navigate('/settings');
        handleClose();
    };

    return (
        <div>
            <AppBar position="static" className="nav">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="back">
                            <ArrowBackIosIcon/>
                        </IconButton>
                    </Typography>

                    {(gebruiker?.role === 'Patient') && (
                        <>
                            <Button color="inherit" onClick={() => navigate('/Patient/1')}>
                                Home
                            </Button>
                        </>
                    )}

                    {(gebruiker?.role === 'Personeel' || gebruiker?.role === 'Arts') && (
                        <>
                            <Button color="inherit" onClick={() => navigate('/Patienten')}>
                                Patienten
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/Medicatie')}>
                                Medicatie
                            </Button>
                        </>
                    )}

                    <Button color="inherit" onClick={() => navigate('/afdelingen')}>
                        Overzicht
                    </Button>

                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ml: 2}}
                        aria-controls={anchorEl ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={anchorEl ? 'true' : undefined}
                        className={"bg-light"}
                    >
                        <Box
                            component="img"
                            src={patientImageSrc}
                            alt="Patient"
                            sx={{
                                height: 40,
                                width: 40,
                                cursor: 'pointer'
                            }}
                        />
                    </IconButton>

                    <Menu
                        id="account-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        onClick={handleClose}
                        slotProps={{
                            paper: {
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            },
                        }}
                        transformOrigin={{horizontal: 'right', vertical: 'top'}}
                        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    >
                        {gebruiker?.role === 'Patient' && (
                            <MenuItem onClick={() => navigate('/Dossier/1')}>
                                Mijn Dossier
                            </MenuItem>
                        )}
                        <MenuItem onClick={handleSettings}>
                            Settings
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    )
        ;
};
