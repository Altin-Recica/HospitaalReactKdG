# Hospital React Project

Examenproject 2024-2025
Gebouwd met **React, TypeScript en Vite**.

## Project Overzicht
Een webapplicatie voor ziekenhuisbeheer, waarbij verschillende rollen (niet-ingelogd, patiënt, verplegend personeel, arts) toegang hebben tot specifieke functies.

## Basisfunctionaliteit
- **Niet-ingelogde gebruiker**: Bekijk afdelingen en kamers (plattegrond & lijst)
- **Patiënt**: Bekijk eigen dossier, medicatie, vraag om hulp
- **Verplegend personeel**: Bekijk en beheer patiënten, medicatie toedienen, kamers toewijzen
- **Arts**: Medicatie toevoegen/verwijderen, patiënt gegevens beheren

## User Stories
- Overzicht afdelingen en kamers
- Medicatie schema bekijken en aanpassen
- Patiënt gegevens aanpassen
- Hulp oproepen beheren
- Real-time updates via polling

## Wireframes & Usability Tests
- Wireframes (mobile first) toegevoegd in `/wireframes`
- Minimaal 3 key-task usability tests uitgevoerd

## Technologieën
- React 
- TypeScript
- Vite
- React Router
- React Query (of vergelijkbaar)
- Bootstrap voor styling
- JSON-server backend

## Installatie
1. Clone de repository:
   ```bash
   git clone https://github.com/Altin-Recica/HospitaalReactKdG.git
   ```
2. Installeer dependencies:
   ```bash
   npm install
   ```
3. Start JSON-server:
   ```bash
   npm run dev
   ```
4. Run de app:
   ```bash
   npm run dev
   ```

## Opmerkingen
- Rollen worden gesimuleerd via testknopjes
- Polling gebruikt voor real-time updates
- Responsive design voor mobiel, tablet en desktop
- Plattegrond gebruikt absolute positioning t.o.v. parent container

## Auteur
**Altin Recica** – Examenproject KDG Hogeschool
