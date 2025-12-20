This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Known Issues and Solutions

### Data Not Displaying (Teachers and Schedule Pages)

**Issue:** Pages like `/dashboard/schedule/teachers`, `/dashboard/schedule`, and `/dashboard/schedule/request` initially showed "No data available" or failed to load data despite having records in the MongoDB database.

**Root Causes:**
1. Database access method inconsistency - The app used Prisma for authentication but was using direct MongoDB connection for fetching data
2. Field name mismatch - Front-end components were looking for `_id` field but Prisma returns `id`
3. Missing fields in database - Additional fields might not exist in all records
4. Incorrect API implementation for filtering by multiple status values
5. Inconsistent session status values between front-end and back-end

**Solution:**
1. Updated all API routes to use Prisma instead of direct MongoDB connection
2. Changed the interfaces in the front-end to use `id` instead of `_id`
3. Added default values for missing fields
4. Transformed data from Prisma to match the expected format in the front-end
5. Created specialized endpoints for complex queries (like teacher schedules)
6. Standardized session status values to use 'scheduled', 'completed', and 'cancelled'

**Fixed Components:**
- Teachers page: 
  - Front-end: `src/app/dashboard/schedule/teachers/page.tsx`
  - API endpoint: `src/app/api/users/route.ts`
- Schedule page:
  - Front-end: `src/app/dashboard/schedule/page.tsx`
  - API endpoints: 
    - `src/app/api/sessions/route.ts`
    - `src/app/api/sessions/[sessionId]/route.ts`
- Request page:
  - Front-end: `src/app/dashboard/schedule/request/page.tsx`
  - API endpoints:
    - `src/app/api/users/route.ts` (for teacher list)
    - `src/app/api/teachers/[teacherId]/schedule/route.ts` (for teacher's schedule)
    - `src/app/api/sessions/route.ts` (for creating new sessions)

**Improvements Made:**
1. **Enhanced Error Handling**
   - Added detailed error messages for scheduling conflicts
   - Improved validation for date/time inputs
   - Better handling of server-side errors with specific error codes
   - Clear user feedback for validation issues

2. **Scheduling System**
   - New dedicated endpoint for teacher schedules
   - Conflict detection for overlapping sessions
   - Automatic end time calculation (1 hour after start time)
   - Visual display of teacher's existing schedule
   - Prevention of past date scheduling
   - Timezone handling improvements

3. **User Experience**
   - Real-time validation feedback
   - Loading states during data fetching
   - Improved form layout and organization
   - Clear success/error notifications
   - Responsive design for all screen sizes

**Note:** If similar issues occur with other data not displaying, check for:
- Consistency in database access methods (use Prisma throughout)
- Field name consistency between front-end and back-end
- Default values for optional fields
- Proper handling of complex queries with multiple values
- Status value consistency across the application
- Proper error handling and user feedback

### Route Handler Type Error in Next.js App Router

**Issue:** Type error in route handlers where params type was incompatible with Next.js expectations:
```typescript
Type '{ sessionId: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
```

**Solution:**
1. Updated RouteContext type to wrap params in Promise
2. Added await when accessing params in route handlers

```typescript
// Before
type RouteContext = {
  params: {
    sessionId: string;
  };
};

// After
type RouteContext = {
  params: Promise<{
    sessionId: string;
  }>;
};

// Usage
const { sessionId } = await params;
```

### Framer Motion Button Component Type Incompatibility

**Issue:** Type error between React button elements and framer-motion components:
```typescript
Type 'AnimationEventHandler<HTMLButtonElement>' is not assignable to type '(definition: AnimationDefinition) => void'
```

**Solution:**
1. Properly extend both HTMLButtonElement and HTMLMotionProps with Omit
2. Explicitly define children type to ensure React.ReactNode compatibility

```typescript
// Before
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // ...
}

// After
export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">>,
    Omit<HTMLMotionProps<"button">, 'children'>,
    VariantProps<typeof buttonVariants> {
  // ...
  children?: React.ReactNode;
}
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## File Uploads in Production

When deploying to Vercel or other serverless platforms, file uploads directly to the filesystem won't work because the filesystem is read-only. This project uses Cloudinary for file storage in production.

### Setting Up Cloudinary

1. Create a free account on [Cloudinary](https://cloudinary.com/)
2. From your Cloudinary dashboard, get your:
   - Cloud name
   - API Key
   - API Secret
3. Add these environment variables to your Vercel project:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

Cloudinary's free tier includes:
- 25GB of storage
- 25GB of monthly bandwidth
- Basic transformations and optimizations

This should be sufficient for most small to medium applications.
