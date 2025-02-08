# Powder Coating Pro Website

A modern, responsive website for a powder coating business built with React, TypeScript, Firebase, and Tailwind CSS.

## Features

- Modern, responsive design with Tailwind CSS
- User authentication with email/password and social login (Google, Facebook)
- Admin dashboard for managing quotes and services
- Customer quote submission and tracking system
- Real-time updates using Firebase Realtime Database
- Interactive services showcase with animations using Framer Motion
- Contact form with reCAPTCHA validation
- Google Maps integration
- SEO optimization with React Helmet
- Form validation with React Hook Form and Zod
- Toast notifications for user feedback
- File upload capabilities with React Dropzone
- Responsive image handling with Unsplash integration

## Tech Stack

- React 18 with TypeScript
- Firebase (Authentication, Realtime Database)
- Tailwind CSS for styling
- Headless UI and Heroicons for UI components
- Framer Motion for animations
- React Router for navigation
- React Hook Form for form management
- Zod for schema validation
- Express.js for backend services
- Node.js mailer for email functionality

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Realtime Database enabled
- Environment variables configured (see below)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_MEASUREMENT_ID=your_measurement_id
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd powder-coating-pro
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
- Copy `.env.example` to `.env`
- Fill in your Firebase and other API credentials

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

```
src/
├── components/     # React components
│   ├── admin/     # Admin dashboard components
│   ├── auth/      # Authentication components
│   ├── quote/     # Quote-related components
│   └── user/      # User dashboard components
├── contexts/      # React context providers
├── hooks/         # Custom React hooks
├── lib/          # Firebase and other configurations
├── pages/        # Page components
├── schemas/      # Zod validation schemas
├── services/     # API and service functions
├── styles/       # Global styles and Tailwind config
├── types/        # TypeScript type definitions
└── utils/        # Utility functions
```

## Architecture Overview

The Powder Coating Pro Website is architectured in a modular and scalable fashion, emphasizing a clear separation of concerns among UI components, business logic, and service integrations. The UI is built using React, TypeScript, and Tailwind CSS for a modern, responsive experience. Firebase handles authentication, real-time updates, and hosting, while Express.js and Node.js support backend services. This organized structure promotes maintainability, scalability, and effective collaboration.

## Available Scripts

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build locally
- `npm run test` - Runs the test suite
- `npm run lint` - Runs ESLint
- `npm run type-check` - Runs TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Next Steps

- Enhance the admin dashboard with additional features and analytics, including:
  - Integrate real-time performance metrics and data visualizations.
  - Implement detailed usage tracking and reporting for user activities.
  - Add customizable filter and search functionalities for efficient data management.
- Continue developing and refining the quote submission system, focusing on:
  - Optimizing the user interface for a smoother submission process.
  - Enhancing form validation, error handling, and real-time feedback.
  - Incorporating live notifications upon successful submissions.
- Increase test coverage and set up continuous integration, including:
  - Implementing unit and integration tests using Jest and React Testing Library.
  - Configuring automated testing and build workflows with GitHub Actions or similar CI tools.
  - Monitoring code coverage metrics to ensure quality standards are met.
- Explore further integrations, such as advanced mapping or media galleries, including:
  - Integrating interactive maps (using Google Maps or Mapbox) with clustering and event features.
  - Developing a dynamic media gallery to showcase project images and videos.
  - Combining mapping data with rich media content for an enhanced user experience. 