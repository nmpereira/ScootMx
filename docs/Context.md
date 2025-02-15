# Scooter Rental App Specification

This document outlines the detailed flow and features of the scooter (and ATV) rental app intended for markets in Mexico (e.g., Tulum, Cancun) and internationally. The app connects vehicle owners (both individuals and rental stores) with potential renters (mainly tourists and short-term visitors). The platform supports posting detailed vehicle listings, scheduling availability, and direct messaging between parties for arranging rentals and in-person cash transactions.

---

## Table of Contents

- [Overview](#overview)
- [User Roles](#user-roles)
- [Core Features](#core-features)
- [User Flows](#user-flows)
  - [Owner (Rentee) Flow](#owner-rentee-flow)
  - [Renter Flow](#renter-flow)
- [Application Pages & Components](#application-pages--components)
- [State Management](#state-management)
- [API Communication](#api-communication)
- [UI Components](#ui-components)
- [Admin Panel and Moderation](#admin-panel-and-moderation)
- [Additional Considerations](#additional-considerations)
- [Technical Considerations](#technical-considerations)
- [Optimal Folder Structure](#optimal-folder-structure)

---

## Overview

The app serves as a marketplace for scooter and ATV rentals. It enables:
- **Vehicle Owners/Rentees**: Individuals or businesses can list their vehicles with photos, detailed descriptions, rental terms, and availability dates.
- **Renters**: Users (primarily tourists) can search for available vehicles by date, location, and other filters, then contact owners directly via in-app messaging.

The app is designed to be scalable to support multiple countries and various types of vehicles (scooters, ATVs, etc.).

---

## User Roles

1. **Vehicle Owner / Rentee**
   - Can be an individual owner (e.g., long-term tourist) or a business (rental store).
   - Responsibilities include creating and managing vehicle listings, setting rental terms, and managing availability dates.

2. **Renter**
   - Typically tourists or visitors looking for temporary transportation.
   - Responsibilities include searching for vehicles, viewing listings, and communicating with owners to negotiate rental details.

3. **Admin**
   - Oversees the platform, moderates content, manages disputes, and handles overall maintenance of the app.

---

## Core Features

### Common Features
- **User Registration & Authentication**  
  - Sign-up options via email.
  - Profile management.

- **Location-Based Search & Filtering**  
  - Map and list views.
  - Filters by location, vehicle type, price per day, availability dates, etc.

- **In-App Messaging**  
  - Secure chat between renters and owners.
  - Ability to discuss details like pickup location, required documents, and rental terms.

- **Booking & Calendar Integration**  
  - Calendar view for owners to mark available dates.
  - Renter booking interface to select rental periods.
  - Conflict resolution: prevent double bookings by syncing availability.

- **Listing Management**  
  - Upload multiple photos and detailed descriptions.
  - Information fields for:
    - Vehicle details (make, model, year, condition).
    - Rental price per day.
    - Included items (helmets, documents, etc.).
    - Terms and conditions.
    - Additional fees or requirements.

- **Review & Rating System**  
  - Both owners and renters can leave reviews after a rental is complete.
  - Helps build trust and quality assurance on both sides.

- **Notifications & Alerts**  
  - Push notifications for messages, booking confirmations, and updates.
  - Email notifications as needed.

### Owner-Specific Features
- **Listing Creation & Editing**
  - Step-by-step wizard to add new listings.
  - Option to schedule availability.
  - Ability to mark listings as active/inactive.

- **Dashboard & Analytics**
  - Overview of active listings, upcoming rentals, and historical rental data.
  - Tools for managing inquiries and messages.

### Renter-Specific Features
- **Search & Filtering**
  - Advanced search options by date, location, vehicle type, and price.
  - Saved searches and favorites list.

- **Booking Interface**
  - Select rental dates.
  - View detailed vehicle information.
  - Initiate contact via messaging system.

- **Profile & Booking History**
  - Manage past and upcoming rentals.
  - Option to save preferred payment methods (if applicable in future enhancements).

---

## User Flows

### Owner (Rentee) Flow

1. **Registration & Onboarding**
   - Owner signs up and verifies identity.
   - Optional onboarding guide/tutorial on how to create and manage listings.

2. **Creating a Listing**
   - **Step 1:** Tap “Create New Listing”.
   - **Step 2:** Fill in vehicle details (make, model, condition, etc.).
   - **Step 3:** Upload photos.
   - **Step 4:** Set rental price per day and any additional fees.
   - **Step 5:** Enter rental terms (documents required, helmet provision, etc.).
   - **Step 6:** Set availability dates on a calendar interface.
   - **Step 7:** Preview and publish listing.

3. **Managing Listings**
   - Edit, delete, or pause listings from a dashboard.
   - Respond to inquiries and negotiate rental details via in-app messaging.
   - Mark dates as booked or unavailable.

4. **Transaction Finalization**
   - Confirm rental agreements through chat.
   - Arrange in-person cash transaction and pickup details.
   - Optionally, mark the transaction as completed and request reviews.

### Renter Flow

1. **Registration & Onboarding**
   - Renter signs up and verifies identity.
   - Optional walkthrough on how to search, book, and communicate.

2. **Searching for a Scooter/ATV**
   - **Step 1:** Enter desired location and rental dates.
   - **Step 2:** Filter results by price, vehicle type, and owner rating.
   - **Step 3:** View listings in list or map format.
   - **Step 4:** Select a listing to see detailed information (photos, rental terms, etc.).

3. **Initiating Rental**
   - **Step 1:** Tap “Contact Owner” to start a chat.
   - **Step 2:** Ask questions regarding availability, required documents, and pickup location.
   - **Step 3:** Negotiate and confirm rental dates.
   - **Step 4:** Finalize details and arrange for in-person cash transaction upon meeting.

4. **Post-Rental**
   - Provide ratings and reviews for the vehicle and owner.
   - Access rental history in the profile section.

---

## Application Pages & Components

### 1. Landing/Home Page
- Brief introduction to the service.
- Call-to-action buttons for “Find a Scooter” and “List Your Vehicle”.
- Location-based suggestions.

### 2. Registration/Login Pages
- Forms for creating an account.
- Social login integration.
- Password recovery and multi-factor authentication (if needed).

### 3. Dashboard (For Both Roles)
- **Owner Dashboard:**
  - Overview of active listings.
  - Calendar with bookings.
  - Quick access to messaging.
- **Renter Dashboard:**
  - Search history.
  - Active and past bookings.
  - Favorites list.

### 4. Listing Creation/Edit Page
- Multi-step form (as outlined in the Owner Flow).
- Calendar integration for scheduling.
- Photo upload module with preview functionality.

### 5. Search & Listing Page
- Filters (date, price, vehicle type, etc.).
- Results in list or map view.
- Listing cards displaying key information.

### 6. Listing Details Page
- Full vehicle details.
- Owner’s profile snippet.
- Calendar availability.
- “Contact Owner” button leading to in-app messaging.

### 7. Messaging Interface
- Chat system similar to popular messaging apps.
- Notification integration for new messages.
- Ability to send images and location details.

### 8. Profile Page
- User information, reviews, and ratings.
- Option to edit profile details.
- Payment method storage (if expanding beyond cash transactions).

### 9. Settings & Help
- Account settings (privacy, notifications, etc.).
- FAQ and support contact.
- Terms & conditions and rental agreement guidelines.

---

## State Management

- **GlobalProvider (Context API):** Manages global state, including authentication status (`isLogged`), user information (`user`), and loading state (`loading`).

---

## API Communication

- **Appwrite SDK:** Used for backend services, including authentication, database, and storage.
- **Axios:** Used for making HTTP requests to external APIs (if any).

---

## UI Components

- **Gluestack UI:** A set of accessible React Native components used for building the user interface.
- **Tailwind CSS:** Used for styling components.
- **Nativewind:** Used to apply Tailwind CSS styles in React Native.
- **React Native Reanimated:** Used for smooth animations.
- **React Native Safe Area Context:** Used for handling safe area insets.
- **React Native Gesture Handler:** Used for handling gestures.
---

## Admin Panel and Moderation

- **User Management:**  
  - Ability to view, edit, or suspend accounts.
  - Identity verification review for both owners and renters.

- **Content Moderation:**  
  - Review listings for compliance with guidelines.
  - Handle reported listings or user behavior.
  
- **Transaction and Booking Monitoring:**  
  - Oversee disputes.
  - Analytics dashboard for overall platform usage and performance.

- **Support Ticket System:**  
  - Manage user queries and complaints.
  - Provide resolutions and escalate issues as necessary.

---

## Additional Considerations

- **Security:**  
  - Secure authentication and user data protection.
  - Encryption for in-app messaging and sensitive data.
  
- **Localization & Currency:**  
  - Multi-language support and currency conversion for international users.
  - Location-based content adjustments.

- **Scalability:**  
  - Backend infrastructure that supports growth into new markets and vehicle categories.
  - API endpoints for potential integrations (payment gateways, mapping services, etc.).

- **Legal & Compliance:**  
  - Terms of service and rental agreements tailored to local laws.
  - Privacy policy and user consent for data usage.

---

## Technical Considerations

- **Front-End Framework:**  
  - React Native with Expo.

- **Back-End Infrastructure:**  
  - Appwrite.

- **Third-Party Integrations:**  
  - Maps and location services (e.g., Google Maps API).
  - Push notifications (e.g., Firebase Cloud Messaging).
  - Cloud storage for images (e.g., AWS S3, Google Cloud Storage).

- **Deployment & Monitoring:**  
  - Cloud-based hosting (AWS, Google Cloud, Azure).
  - Continuous integration/continuous deployment (CI/CD) pipeline.
  - Monitoring tools for uptime and performance analytics.

---

## Optimal Folder Structure

```plaintext
car-rental-app/
├── app/
│   ├── (auth)/
|   |   ├── _layout.tsx
│   │   ├── signIn.tsx
│   │   └── signUp.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── listings.tsx
│   │   ├── create.tsx
│   │   ├── messages.tsx
│   │   └── settings.tsx
│   ├── _layout.tsx
│   ├── +not-found.tsx
│   └── index.tsx
├── src/
│   ├── api/
│   │   ├── appwrite.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── (various UI components)
│   │   ├── CustomButton.tsx
│   │   ├── FormField.tsx
│   │   ├── Alert.tsx
│   │   ├── PhotoUpload.tsx
│   │   ├── DropDownSelector.tsx
│   │   ├── ScooterCard.tsx
│   │   └── EmptyState.tsx
│   ├── context/
│   │   └── GlobalProvider.tsx
│   ├── constants/
│   │   └── icons.js
│   ├── lib/
│   │   └── appwrite.ts
│   ├── utils/
│   │   └── utls.ts
├── assets/
│   ├── fonts/
│   └── images/
├── app.json
├── babel.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── global.css