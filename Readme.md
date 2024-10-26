# DeployIt

![Made with TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-007acc.svg)

DeployIt is a project bootstrapped with [Next.js](https://nextjs.org) and powered by [React](https://reactjs.org). Visit [DeployIt](https://deployit.live) to get started.

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- pnpm (preffered)

### Installation
Clone the repository:

```bash
git clone https://github.com/Pulkitxm/DeployIt.git
cd DeployIt
```

### Install dependencies:

```bash
pnpm install
# or 
npm install
# or
yarn install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

### Project Structure

The project is structured as follows:

```bash
├── app(nextjs app)
├── docker-builder(docker image for building project)
├── docker-orch(docker image for deploying project)
├── not-found(react app for 404 page)
├── proxy-server(express server for proxying requests)
├── docker-compose.yml
├── dev.docker-compose.yml
```