# VenSport U-13 League - Next.js

This project has been converted from Create React App to Next.js for better performance and Vercel deployment.

## Available Scripts

### `npm run dev`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`
Builds the app for production to the `out` folder.
The build is optimized for the best performance.

### `npm start`
Starts the production server after building.

## Deployment to Vercel

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Deploy to Vercel:
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js and deploy
   - Or use Vercel CLI: `vercel --prod`

## Project Structure

- `app/` - Next.js app directory with layout and main page
- `src/` - Original React components and utilities
- `public/` - Static assets
- `next.config.js` - Next.js configuration for static export
- `vercel.json` - Vercel deployment configuration

## Features

- Static site generation for optimal performance
- Client-side navigation replacing React Router
- Optimized for Vercel deployment
- All original functionality preserved# vensport-u13-league
