export interface Kamer {
    id: number;
    kamernummer: number;
    afdelingNaam: string;
    type: 'basis' | 'luxe';
    status: 'Beschikbaar' | 'Bezet';
    image: string;
    patientid: number;
}