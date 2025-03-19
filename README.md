# ScoreOBE+ Frontend

ScoreOBE+ is a web-based information management system designed for outcome-based education. It facilitates score management, analysis, and publication for instructors and students.

## Installation

Ensure you have [Node.js](https://nodejs.org/) installed.

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and configure it based on `.env.example`

## Running the App

### Development Mode

Run the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000` (or another port if specified).

### Production Build

Build the application for production:
   ```bash
   npm run build
   ```

## Deployment

Build the Docker container:
   ```bash
   docker compose up --build -d
   ```

## Copyright
© 2025 Computer Engineering, Chiang Mai University. All rights reserved.

