# Website Translation Plan

This document tracks the progress of translating the UniMatch website into all supported languages.

## Overview
- **Goal**: Enable full translation support across all pages.
- **Languages**: English, Arabic, French.
- **Current Status**: `LanguageContext` exists but is not globally implemented. Most pages have hardcoded text.

## Implementation Steps
1.  [x] **Global Setup**: Add `LanguageProvider` to `src/app/layout.tsx`.
2.  [ ] **Iterate Pages**: For each page listed below:
    *   Identify all hardcoded text strings.
    *   Add translation keys to `src/contexts/LanguageContext.tsx`.
    *   Replace hardcoded text with `t('key')` hook.
    *   Verify layout for RTL (Arabic support).

## Progress Tracker

| Page / Component | Status | Progress | Notes |
| :--- | :--- | :--- | :--- |
| **Global Layout** | 🟢 Done | 100% | `LanguageProvider` injected. |
| **Landing Page** (`/app/page.tsx`) | 🟢 Done | 100% | Redirects to dashboard/login. No text. |
| **Auth Pages** | | | |
| - Sign In | 🟢 Done | 100% | Form and page translated. |
| - Register | 🟢 Done | 100% | Registration form translated. |
| **Dashboard Main** (`/app/dashboard/page.tsx`) | 🟢 Done | 100% | Translated stats, headers, actions. |
| **Dashboard Navigation** | 🟢 Done | 100% | Sidebar, role-based menu items, profile dropdown. |
| **Dashboard Sections** | | | |
| - Admin Area | 🔴 Pending | 0% | |
| - AI Chat | 🔴 Pending | 0% | |
| - Career Boost | 🔴 Pending | 0% | |
| - Courses | � Done | 100% | |
| - Find Tutor | � Done | 100% | |
| - Learning Hub | 🟢 Done | 100% | |
| - Messages | � Done | 100% | |
| - Schedule | � Done | 100% | |
| - Settings | � Done | 100% | |
| - Student Area | 🔴 Pending | 0% | |
| - Tutor Area | 🔴 Pending | 0% | |

## Detailed Breakdown

### 1. Global Layout
- **File**: `src/app/layout.tsx`
- **Action**: Wrap application in `LanguageProvider`.

### 2. Landing Page
- **File**: `src/app/page.tsx`
- **Action**: Translate hero section, features, testimonials, footer.

### 3. Authentication
- **Files**: `src/app/auth/signin/page.tsx`, `src/app/auth/register/page.tsx`
- **Action**: Translate form labels, buttons, error messages.

### 4. Dashboard
- **File**: `src/app/dashboard/layout.tsx` (Sidebar/Header)
- **Action**: Ensure navigation items are completely covered (partially done in `LanguageContext`).

### 5. Dashboard Pages
(List continues for specific features...)
