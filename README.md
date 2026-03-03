# DevBuilder Admin Panel

This repository contains the Next.js admin panel and website builder dashboard (Demo Branch).

## Overview

DevBuilder is a modern website builder platform. This specific branch (`demo`) is configured for demonstration purposes. Security and authentication requirements have been loosened to allow easy access for reviewers (e.g. bypassing login via `admin` / `admin`).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4, Framer Motion, GSAP
- **Components**: Radix UI, lucide-react, Embla Carousel
- **State Management**: Redux Toolkit, Redux Persist
- **Forms**: React Hook Form + Zod
- **Drag and Drop**: @dnd-kit

## Demo Notice

**⚠️ This branch disables strict token authentication for easy access.**
You can log in to the dashboard using these credentials:

- **Email**: `admin`
- **Password**: `admin`

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
