import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import {RolKiezen} from "./components/Rollen/RolKiezen.tsx";
import {Personeel} from "./components/Rollen/Personeel.tsx";
import {Patient} from "./components/Rollen/Patient.tsx";
import {NietAangemeld} from "./components/Rollen/NietAangemeld.tsx";
import {Arts} from "./components/Rollen/Arts.tsx";
import axios from 'axios'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {AuthProvider} from "./context/AuthContext.tsx";
import {Afdeling} from "./components/Afdeling.tsx";
import {ThemeProviderWrapper} from './context/ThemeContext.tsx';
import {Kamers} from "./components/Kamers/Kamers.tsx";
import {Patienten} from "./components/Patient/Patients.tsx";
import {Dossier} from "./components/Patient/Dossier.tsx";
import Settings from "./components/Settings.tsx";
import {Navbar} from "./components/Navbar.tsx";
import {MedicationList} from "./components/Patient/MedicatieLijst.tsx";
import {HulpVragenContextProvider} from "./context/HulpVragenContextProvider.tsx";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
const queryClient = new QueryClient()

function Layout() {
    const location = useLocation();

    return (
        <>
            <main>
                {location.pathname !== '/' && <Navbar/>}
                <Routes>
                    <Route path="/" element={<RolKiezen/>}/>
                    <Route path="/niet-aangemeld" element={<NietAangemeld/>}/>
                    <Route path="/patient/:id" element={
                        <HulpVragenContextProvider>
                            <Patient/>
                        </HulpVragenContextProvider>
                    }/>
                    <Route path="/personeel" element={<Personeel/>}/>
                    <Route path="/arts" element={<Arts/>}/>
                    <Route path="/afdelingen" element={<Afdeling/>}/>
                    <Route path="/kamers/:afdelingNaam" element={
                        <HulpVragenContextProvider>
                            <Kamers/>
                        </HulpVragenContextProvider>
                    }/>
                    <Route path="/patienten" element={<Patienten/>}/>
                    <Route path="/dossier/:id" element={<Dossier/>}/>
                    <Route path="/medicatie" element={<MedicationList/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                </Routes>
            </main>
        </>
    );

}


function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProviderWrapper>
                    <BrowserRouter>
                        <Layout/>
                    </BrowserRouter>
                </ThemeProviderWrapper>
            </AuthProvider>
        </QueryClientProvider>
    )

}

export default App
