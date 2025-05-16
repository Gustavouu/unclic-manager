
# Custom Hooks Documentation

## Table of Contents
- [Authentication Hooks](#authentication-hooks)
- [Business Hooks](#business-hooks)
- [Data Fetching Hooks](#data-fetching-hooks)

## Authentication Hooks

### `useAuth`
Manages authentication state and provides login, signup, and logout functionality.

```typescript
const { 
  user, 
  isLoading, 
  login, 
  signup, 
  logout, 
  isAuthenticated,
  resetPassword
} = useAuth();
```

**Returns:**
- `user`: The currently authenticated user or null
- `isLoading`: Boolean indicating if auth state is being loaded
- `isAuthenticated`: Boolean indicating if a user is authenticated
- `login`: Function to log in a user with email and password
- `signup`: Function to register a new user
- `logout`: Function to log out the current user
- `resetPassword`: Function to request a password reset

## Business Hooks

### `useCurrentBusiness`
Provides access to the current business data and operations.

```typescript
const {
  business,
  isLoading,
  error
} = useCurrentBusiness();
```

**Returns:**
- `business`: The currently selected business data
- `isLoading`: Boolean indicating if business data is loading
- `error`: Any error that occurred during data fetching

### `useBusinessSettings`
Manages business settings data and operations.

```typescript
const {
  settings,
  isLoading,
  updateSettings,
  error
} = useBusinessSettings(businessId);
```

**Parameters:**
- `businessId`: UUID of the business to get settings for

**Returns:**
- `settings`: The business settings object
- `isLoading`: Boolean indicating if settings are loading
- `updateSettings`: Function to update business settings
- `error`: Any error that occurred during data fetching

## Data Fetching Hooks

### `useDashboardData`
Fetches and provides dashboard data.

```typescript
const {
  dashboardData,
  isLoading,
  error,
  refetch
} = useDashboardData(period);
```

**Parameters:**
- `period`: The time period for the dashboard data ('day', 'week', 'month', 'year')

**Returns:**
- `dashboardData`: The dashboard statistics and metrics
- `isLoading`: Boolean indicating if data is loading
- `error`: Any error that occurred during data fetching
- `refetch`: Function to manually refetch the data
