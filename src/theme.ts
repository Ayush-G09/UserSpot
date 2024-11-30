import { Mode } from "./types";

const lightMode = {
    primary: '#fafafa',
    secondary: '#e4e5f1',
    tertiary: '#d2d3db',
    blue: '#0288d1',
    font: '#000000',
};

const darkMode = {
    primary: '#3e3e42',
    secondary: '#2d2d30',
    tertiary: '#252526',
    blue: '#29b6f6',
    font: '#ffffff',
};

export const generateTheme = (mode: Mode) => ({
    font: mode === 'light' ? lightMode.font : darkMode.font, 
    blue: mode === 'light' ? lightMode.blue : darkMode.blue,
    primary: mode === 'light' ? lightMode.primary : darkMode.primary,
    secondary: mode === 'light' ? lightMode.secondary : darkMode.secondary,
    tertiary: mode === 'light' ? lightMode.tertiary : darkMode.tertiary,
});
  