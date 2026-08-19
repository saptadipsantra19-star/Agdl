# Agriculture with DL

A comprehensive AI-powered agricultural dashboard designed for farmers. This application provides tools for farm management, crop diagnosis, yield prediction, local weather tracking, and an integrated AI assistant (Gemini) that provides tailored farming advice and directs users to online shopping for agricultural supplies.

## Features

- **Farmer Dashboard**: Overview of farm location, current crops, market prices, and quick stats.
- **AI Assistant (DL with Gemini)**: Context-aware AI chat that knows your location and time, answers agricultural queries, and provides direct search links to Amazon and Flipkart for supplies.
- **Plant Diagnosis**: Upload images of crops for AI-powered disease diagnosis and treatment recommendations.
- **Alerts & Problems**: Track active alerts for pests, weather, or irrigation needs.
- **Map View**: Visualize farm zones, soil conditions, and crop distribution.
- **Online Shopping**: Quick links to search for agricultural tools, seeds, and fertilizers on Amazon and Flipkart.
- **Firebase Authentication**: Secure Google Sign-in and user profiles via Firebase.
- **Dark/Light Mode**: Full theme support for optimal visibility in any environment.

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express (running as a single full-stack Vite setup)
- **Database & Auth**: Firebase (Firestore, Google Authentication)
- **AI**: Google Gemini API

## Prerequisites

- Node.js (v18 or newer recommended)
- A Firebase Project (with Authentication and Firestore enabled)
- A Google Gemini API Key

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Firebase Configuration**
   The Firebase configuration is located in `firebase-applet-config.json`. Update it with your project's credentials if you haven't already. Make sure Google Sign-in and Firestore are enabled in your Firebase Console.

## Running Locally

To start the development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
npm run start
```

## Security Note

This repository includes a `.gitignore` that prevents your `.env` file (containing your secret API keys) from being uploaded to GitHub. Never commit your `GEMINI_API_KEY` to public version control.
