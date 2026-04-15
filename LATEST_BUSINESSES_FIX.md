## Latest Businesses Homepage Issue - Fixed

### Problem
New businesses added to the platform were not appearing in the homepage's "Latest Businesses" section.

### Root Cause
The `fetchLatestBusinesses()` function in `/lib/firebase-server.ts` had its own local definition of `LIVE_STATUSES`:
```
const LIVE_STATUSES = new Set(['approved', 'active', 'live', ''])
```

However, when businesses are submitted via the add-business form, they are saved with `status: 'approved'`. 

The issue was that `firebase-server.ts` had an outdated/duplicate definition that was separate from the authoritative one in `/lib/category-mappings.ts` which defines:
```
export const LIVE_STATUSES = new Set(['approved', 'pending'])
```

This inconsistency meant businesses could have status values that weren't being recognized as "live" by different parts of the application.

### Solution
1. Imported `LIVE_STATUSES` from `category-mappings.ts` into `firebase-server.ts`
2. Removed the duplicate local `LIVE_STATUSES` definition
3. Now all pages use the same authoritative status filtering rules

### Files Modified
- `/lib/firebase-server.ts` - Updated to import LIVE_STATUSES from category-mappings

### Result
- New businesses with `status: 'approved'` will now appear in the homepage latest businesses section
- All business queries across the site now use consistent status filtering
- The system has a single source of truth for what constitutes a "live" business status
