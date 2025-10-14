# SuperSafe Wallet Documentation

This repository contains the source code for the official documentation of SuperSafe Wallet, available at [docs.supersafe.cool](https://docs.supersafe.cool).

The documentation is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

The primary source markdown files used to generate this documentation are located in the `doc-sources/` directory. The final Docusaurus-compatible markdown files are within the `docs/` directory.

## Local Development

To run a local instance of the documentation website for development or preview purposes:

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone https://github.com/JesCR/supersafe-docs.git
    cd supersafe-docs
    ```

2.  **Install dependencies:**
    Using `npm`:
    ```bash
    npm install
    ```

3.  **Start the development server:**
    Using `npm`:
    ```bash
    npm run start
    ```
    This command starts a local development server (usually at `http://localhost:3000`) and opens up a browser window. Most changes to the documentation files in `docs/` are reflected live without having to restart the server.

## Build

To generate the static HTML/CSS/JS files for the website:

Using `npm`:
```bash
npm run build
```
This command generates static content into the `build` directory. These files can then be deployed to any static content hosting service.

## Deployment

The Docusaurus documentation provides several ways to deploy. For GitHub Pages (which is a common choice for Docusaurus projects), you can use the `deploy` script if configured.

If your `package.json` includes a `deploy` script configured for GitHub Pages, you might run:
```bash
npm run deploy
```
Or, following the original template's suggestion for GitHub Pages:
Using SSH:
```bash
USE_SSH=true yarn deploy 
```
Not using SSH:
```bash
GIT_USER=<Your GitHub username> yarn deploy
```
*(If you primarily use `npm`, ensure your `deploy` script in `package.json` is set up accordingly or adapt the `yarn` commands for `npm` if necessary, e.g., by setting environment variables directly).*

Alternatively, you can manually deploy the contents of the `build` directory to your preferred hosting provider (like Vercel, Netlify, or your own server).

## Contributing

If you wish to contribute to the documentation:
1. Ensure your changes are made to the relevant source files (often starting in `doc-sources/` which are then used to generate files in `docs/`).
2. Follow the local development guide to preview your changes.
3. Submit a pull request with your proposed updates.
