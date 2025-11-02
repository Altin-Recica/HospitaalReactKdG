import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    body {
        transition: background-color;
        background-color: ${(props) => (props.theme.palette.mode === 'light' ? '#ffffff' : '#121212')};
        color: ${(props) => (props.theme.palette.mode === 'light' ? '#000000' : '#ffffff')};
    }

    .nav {
        transition: background-color 0.2s ease;
        background-color: ${(props) => (props.theme.palette.mode === 'light' ? '#ffffff' : '#121212')};
        color: ${(props) => (props.theme.palette.mode === 'light' ? '#000000' : '#ffffff')};
    }

    .btn {
        transition: background-color 0.2s ease;
        background-color: ${(props) => (props.theme.palette.mode === 'light' ? '#121212' : '#ffffff')};
        color: ${(props) => (props.theme.palette.mode === 'light' ? '#ffffff' : '#121212')};
    }

    .rolImage {
        transition: background-color 0.2s ease;
        background-color: ${(props) => (props.theme.palette.mode === 'light' ? '#ffffff' : '#ffffff')};
    }

    .role-card:hover {
        transition: background-color 0.2s ease;
        background-color: ${(props) => (props.theme.palette.mode === 'light' ? '#121212' : '#ffffff')};
        color: ${(props) => (props.theme.palette.mode === 'light' ? '#ffffff' : '#000000')};
        cursor: pointer;
    }

`;