# Muslim Prayer Times App

A mobile-first web application that displays Muslim prayer times based on the user's location. The app fetches prayer times from the Muwaqqit API and provides a clean, user-friendly interface for viewing prayer times.

## Features

- Geolocation-based prayer times
- Calendar slider for date selection
- Upcoming prayer highlighting with countdown timer
- Caching of prayer times data to reduce API calls
- Mobile-first responsive design
- Manual refresh option
- Calendar dialog for flexible date selection

## Technologies Used

- Next.js (App Router)
- TypeScript
- Tailwind CSS 4
- React Calendar
- Date-fns for date manipulation
- Geolib for geolocation calculations

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/muwaqqit-prayer-app.git
   cd muwaqqit-prayer-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Building for Production

```bash
npm run build
npm start
```

## API

The application uses the Muwaqqit API to fetch prayer times:
```
https://www.muwaqqit.com/api.json?lt={latitude}&ln={longitude}&d={date}&tz={timezone}
```

Where:
- `latitude` and `longitude` are the user's coordinates
- `date` is in the format YYYY-MM-DD
- `timezone` is the user's timezone (e.g., Asia/Kolkata)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
