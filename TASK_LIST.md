# Project Status: UI Refactoring & Backend Integration Tasks

This document identifies features that are currently implemented as "UI Shells" with mock data and outlines the steps required to connect them to a real backend/database.

## 1. Find Tutor Page (`src/app/dashboard/find-tutor/page.tsx`)

Currently uses a hardcoded `allTutors` array and client-side logic.

- [x] **Data Fetching**: Replace `const allTutors = [...]` with a server-side fetch or API hook to retrieve tutors from a database (`/api/tutors`).
- [x] **Search & Filtering**: Move the `filteredTutors` logic to the backend. The API should accept query parameters for `search`, `subject`, `availability`, etc.
- [x] **AI Matching**: The `handleAIMatch` function currently sends the *hardcoded* list of tutors to the AI. It should instead ask the AI to generate a search query or filter criteria to query the real database, OR the backend should handle the RAG (Retrieval-Augmented Generation) process.
- [ ] **Favorites**: Replace `toggleFavorite` (local React state) with an API call to persist user favorites.
- [ ] **Actions**:
  - **Message Button**: Currently inactive. Needs to initiate a real conversation in the database.
  - **Book Session Button**: Currently inactive. Needs to trigger a booking workflow (calendar connection, payment intent).

## 2. Student Dashboard (`src/app/dashboard/student/page.tsx`)

All widgets are powered by static constants.

- [ ] **Stats Cards**: Connect (Courses Enrolled, Study Hours, Avg Score) to real user analytics endpoints.
- [ ] **My Modules**: Replace the static `modules` array with a fetch to the user's `Enrollments` table. Progress bars should reflect actual lesson completion.
- [ ] **Performance Chart**: Replace `performanceData` and `subjectData` with real historical data from quizzes/assignments.
- [ ] **Recommended Tutors**: Replace `recommendedTutors` static list with a dynamic query based on the student's enrolled subjects or stated interests.
- [ ] **AI Study Assistant**: Verify context injection. Ensure the chat knows about the student's *actual* current course material (requires RAG or context passing).

## 3. Tutor Dashboard (`src/app/dashboard/tutor/page.tsx`)

Designed for tutors but uses static mock data.

- [ ] **Stats Overview**: Connect Earnings, Active Students, and Sessions Completed to the database.
- [ ] **My Bookings**: Replace `upcomingBookings` mock array. Needs a real `Bookings` table query.
- [ ] **Booking Actions**: Implement functionality for the "Video Call" (join link generation) and "Message" buttons on each booking card.
- [ ] **Earnings Chart**: Replace `earningsData` with an aggregation of real `Transactions`.
- [ ] **Student Analytics**: Replace `studentAnalytics` with real engagement data from the courses taught by this tutor.
- [ ] **Feedback**: Replace `recentFeedback` with real data from a `Reviews` table.

## 4. Main Dashboard (`src/app/dashboard/page.tsx`)

- [ ] **User Role Logic**: Ensure the dashboard view correctly toggles between Student and Tutor views based on real `session.user.role` data (currently looks okay but relies on session validity).
- [ ] **Quick Stats**: Replace static `stats` array with data relevant to the logged-in user.
- [ ] **Recent Activity**: Replace `recentActivity` with a unified timeline of real events (messages, bookings, system notifications).
- [ ] **"No Courses" State**: Wire up the emptiness check to the actual length of the user's course list.

## 5. Messaging System (`src/app/dashboard/messages/page.tsx`)

Entirely client-side mock simulation.

- [ ] **Backend Integration**: Implement a real messaging backend (e.g., standard REST + Polling or WebSockets/Supabase Realtime).
- [ ] **Data Schema**: Define `Conversation` and `Message` models in the database.
- [ ] **Contact Discovery**: `mockContacts` should be replaced by a query of users the current user has interacted with (booked tutors, enrolled students).
- [ ] **Sending Messages**: `handleSendMessage` currently just updates local state and sets a timeout for a fake AI response. This needs to POST to an API.
- [ ] **Realtime Updates**: Replace the `setTimeout` simulation of "delivered" and "read" statuses with real socket events.

## 6. General / Infrastructure

- [ ] **Database Setup**: Ensure database tables exist for:
  - `Users` (Students/Tutors)
  - `Courses` & `Enrollments`
  - `Bookings` / `Sessions`
  - `Reviews`
  - `Conversations` & `Messages`
- [ ] **API Routes**: Create Next.js API routes (or Server Actions) to expose CRUD operations for the above entities.
