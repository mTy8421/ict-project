# Project Structure

This document outlines the structure of the frontend project.

## Root Directory

-   **`.dockerignore`**: Specifies files and directories to ignore when building a Docker image.
-   **`.gitignore`**: Specifies intentionally untracked files to ignore.
-   **`Dockerfile`**: Contains instructions for building a Docker image.
-   **`index.html`**: The main HTML file for the application.
-   **`package-lock.json`**: Records the exact version of each installed package.
-   **`package.json`**: Contains project metadata and dependency information.
-   **`postcss.config.cjs`**: Configuration file for PostCSS.
-   **`README.md`**: This file.
-   **`tailwind.config.cjs`**: Configuration file for Tailwind CSS.
-   **`tsconfig.json`**: TypeScript compiler configuration.
-   **`vite.config.ts`**: Configuration file for Vite.
-   **`dist/`**: The build output directory.
-   **`node_modules/`**: Contains all the project's dependencies.
-   **`public/`**: Contains static assets that are publicly accessible.
-   **`src/`**: The application's source code.

## `src` Directory

-   **`app.css`**: Global CSS styles for the application.
-   **`App.tsx`**: The main application component.
-   **`main.tsx`**: The entry point of the application.
-   **`assets/`**: Contains static assets like images and other files.
-   **`components/`**: Contains reusable React components.
    -   **`admin/`**: Components for the admin role.
    -   **`dean/`**: Components for the dean role.
    -   **`head/`**: Components for the head role.
    -   **`user/`**: Components for the user role.
    -   **`vice-dean/`**: Components for the vice-dean role.
-   **`lib/`**: Contains libraries and helper functions.
    -   **`dean/`**: Library files for the dean role.
    -   **`head/`**: Library files for the head role.
    -   **`user/`**: Library files for the user role.
-   **`pages/`**: Contains the application's pages.
    -   **`admin/`**: Pages for the admin role.
    -   **`dean/`**: Pages for the dean role.
    -   **`head/`**: Pages for the head role.
    -   **`home/`**: The home page.
    -   **`user/`**: Pages for the user role.
-   **`theme/`**: Contains theme-related configuration.
-   **`types/`**: Contains TypeScript type definitions.
-   **`utils/`**: Contains utility functions.