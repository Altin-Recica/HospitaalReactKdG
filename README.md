# Hospital React Project

Exam project 2024-2025
Built with **React, TypeScript, and Vite**.

## Project Overview

A web application for hospital management, where different roles (not logged in, patient, nursing staff, doctor) have access to specific features.

## Core Functionality

* **Not logged in user**: View departments and rooms (map & list)
* **Patient**: View own record, medication, request assistance
* **Nursing staff**: View and manage patients, administer medication, assign rooms
* **Doctor**: Add/remove medication, manage patient information

## User Stories

* Overview of departments and rooms
* View and adjust medication schedule
* Edit patient information
* Manage assistance requests
* Real-time updates via polling

## Wireframes & Usability Tests

* Wireframes (mobile first) added in `/wireframes`
* At least 3 key-task usability tests performed

## Technologies

* React
* TypeScript
* Vite
* React Router
* React Query (or similar)
* Bootstrap for styling
* JSON-server backend

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Altin-Recica/HospitaalReactKdG.git
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the backend server:

   ```bash
   npm run simulateBackend
   ```
4. Run the app:

   ```bash
   npm run dev
   ```

## Notes

* Roles are simulated via test buttons
* Polling used for real-time updates
* Responsive design for mobile, tablet, and desktop
* Map uses absolute positioning relative to parent container

## Author

**Altin Recica** – Exam project at KDG University College
