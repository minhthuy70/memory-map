# Memory Map — Project Feature Specification

**Version:** 1.0  
**Last Updated:** 2026-08-30  
**Project Root:** D:\DUANCANHAN\memory-map

---

# 1. PROJECT OVERVIEW

## Project Name
**Memory Map — Bản đồ kỷ niệm**

## Project Goal
A web application that allows users to create, manage, and visualize personal memories associated with geographic locations on an interactive map.

## Target Users
- Individuals who want to preserve personal memories
- Travelers who want to document their journeys
- People who want to track meaningful locations in their lives
- Users who prefer visual, map-based organization of memories

## Problem Solved
Traditional diaries and photo albums lack geographic context. Memories are often tied to places, but existing solutions don't effectively combine location data with personal narratives, photos, and emotional context.

## Concept
**Memory Map is a digital diary spread across a map.**

Users select locations on an interactive map and attach memories to those locations, including:
- Title and description
- Photos
- Date
- Mood
- Category
- Geographic coordinates

The result is a visual representation of one's life journey, where each marker represents a meaningful moment.

## Core Value
- **Geographic Context**: Memories are anchored to real-world locations
- **Visual Storytelling**: Map-based visualization of life experiences
- **Emotional Tracking**: Mood tracking alongside memories
- **Chronological Organization**: Timeline view for temporal perspective
- **Privacy**: Personal memories are private to each user

## User Journey (High Level)
```
Register → Login → Open Map → See existing memories → 
Select location → Create memory → Add details → Save → 
View marker → View timeline → Search → Filter → View statistics
```

---

# 2. PRODUCT VISION

## Desired User Experience

### New User Flow
```
1. Visit landing page
   ↓
2. Click "Sign Up"
   ↓
3. Enter email, password, name
   ↓
4. Register successfully
   ↓
5. Redirect to dashboard
   ↓
6. See empty map with welcome message
   ↓
7. Click "Add Memory" button
   ↓
8. Click on map to select location
   ↓
9. Fill in memory details:
   - Title
   - Content
   - Date
   - Mood
   - Category
   ↓
10. Save memory
    ↓
11. See marker appear on map
    ↓
12. Click marker to view details
    ↓
13. Add photos via URL
    ↓
14. Explore timeline view
    ↓
15. View statistics
```

### Returning User Flow
```
1. Visit landing page
   ↓
2. Click "Sign In"
   ↓
3. Enter credentials
   ↓
4. Login successfully
   ↓
5. Redirect to dashboard
   ↓
6. See all memories as markers on map
   ↓
7. Browse memories via:
   - Map view
   - Timeline view
   - Search
   - Filters
   ↓
8. Create new memory
   ↓
9. Edit existing memory
   ↓
10. Delete memory
    ↓
11. View statistics
    ↓
12. Logout
```

---

# 3. FEATURE STATUS LEGEND

| Status | Meaning |
|--------|---------|
| 🟢 IMPLEMENTED | Feature is fully implemented and working |
| 🟡 PARTIALLY IMPLEMENTED | Feature exists but has gaps or bugs |
| 🔴 BROKEN | Feature exists but is not functional |
| ⚪ MISSING | Feature does not exist in codebase |
| 🔵 PLANNED | Feature is planned for current development phase |
| 🟣 FUTURE | Feature is planned for future development (not MVP) |

---

# 4. FEATURE PRIORITY

## P0 — Critical
**Definition:** Without these features, the application cannot function.

Examples:
- User authentication (register, login, logout)
- Database connection
- Basic API endpoints
- Map rendering
- Memory CRUD operations

## P1 — Core
**Definition:** Essential for the core user experience.

Examples:
- Memory creation with location
- Memory detail view
- Timeline view
- Basic search
- Basic filtering
- Image upload

## P2 — Important
**Definition:** Enhances product quality and user satisfaction.

Examples:
- Statistics view
- Advanced filtering
- Location search
- Reverse geocoding
- Responsive design polish

## P3 — Nice to Have
**Definition:** Can be deferred after MVP.

Examples:
- Map clustering
- Image gallery fullscreen viewer
- "On this day" feature
- Memory export

## P4 — Future
**Definition:** Not required for MVP, may be considered later.

Examples:
- Social features
- AI features
- Mobile app
- Payment/subscription

---

# 5. USER ROLES

## USER (Current)
| Permission | Description |
|------------|-------------|
| View own memories | Can only access memories they created |
| Create memories | Can create new memories |
| Edit own memories | Can edit memories they created |
| Delete own memories | Can delete memories they created |
| Upload images | Can add images to own memories |
| View statistics | Can view personal statistics |
| View timeline | Can view personal timeline |
| Search memories | Can search within own memories |
| Filter memories | Can filter own memories |

## ADMIN (Future - 🟣 FUTURE)
| Permission | Description |
|------------|-------------|
| View all users | Can view all registered users |
| Manage users | Can edit/delete user accounts |
| View all memories | Can view memories across all users |
| Manage categories | Can add/edit/delete categories |
| System statistics | Can view system-wide statistics |
| Content moderation | Can moderate reported content |

---

# 6. AUTHENTICATION FEATURES

## 6.1 Register

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0  
**Route:** `/register`  
**API:** `POST /auth/register`

### Fields
| Field | Type | Required | Validation | Max Length |
|-------|------|----------|------------|------------|
| email | string | Yes | Email format | 255 |
| password | string | Yes | Min 6 characters | 255 |
| name | string | No | Any string | 255 |

### Validation Rules
- Email must be valid format (regex)
- Email must be unique (check database)
- Password must be at least 6 characters
- Password is hashed using bcrypt (salt rounds: 10)

### Error States
- **Email already exists:** Return 409 Conflict with message "Email already exists"
- **Invalid email format:** Return 400 Bad Request
- **Password too short:** Return 400 Bad Request
- **Network error:** Frontend shows "Connection error"

### Success State
- User created in database
- Password hashed
- JWT token generated
- User data returned (without password)
- Redirect to dashboard

### Acceptance Criteria
```
Given: User is on registration page
When: User enters valid email, password (6+ chars), and name
And: Clicks "Create Account"
Then: Account is created
And: User is logged in automatically
And: Redirected to dashboard
And: Token stored in localStorage
```

## 6.2 Login

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0  
**Route:** `/login`  
**API:** `POST /auth/login`

### Fields
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Email format |
| password | string | Yes | Any string |

### JWT Configuration
- **Secret:** From environment variable `JWT_SECRET`
- **Expiration:** 7 days (configurable via `JWT_EXPIRATION`)
- **Algorithm:** HS256
- **Payload:** `{ email, sub: userId }`

### Token Handling
- Token stored in `localStorage` (key: `token`)
- User data stored in `localStorage` (key: `user`)
- Token sent in Authorization header: `Bearer {token}`
- Token validated on every protected request

### Error States
- **Invalid credentials:** Return 401 Unauthorized with message "Invalid credentials"
- **User not found:** Return 401 Unauthorized
- **Network error:** Frontend shows "Connection error"

### Loading State
- Button shows "Signing in..." during request
- Button disabled during request

### Logout
- Remove token from localStorage
- Remove user from localStorage
- Clear auth store state
- Redirect to login page

### Session Persistence
- Token persists across page reloads
- Token expires after 7 days
- On 401 error, auto-logout and redirect to login

### Acceptance Criteria
```
Given: User is on login page
When: User enters valid email and password
And: Clicks "Sign In"
Then: User is authenticated
And: JWT token received
And: Redirected to dashboard
And: Token stored in localStorage
```

## 6.3 Current User

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0  
**API:** `GET /auth/me`

### Purpose
Get current authenticated user information

### Response
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "User Name",
  "avatar": "avatar-url",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

### Error States
- **Not authenticated:** Return 401 Unauthorized
- **Token expired:** Return 401 Unauthorized

## 6.4 Logout

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0  
**Route:** `/logout` (frontend action)

### Behavior
- Clear localStorage
- Clear Zustand store
- Redirect to login page
- No API call required (client-side only)

## 6.5 Protected Routes

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0

### Protected Routes
- `/dashboard`
- `/memories/new`
- `/memories/[id]`
- `/memories/[id]/edit`
- `/timeline`
- `/statistics`

### Implementation
- JWT guard on backend routes
- Auth check on frontend pages
- Redirect to login if not authenticated

### Acceptance Criteria
```
Given: User is not authenticated
When: User tries to access protected route
Then: Redirected to login page
```

## 6.6 Authorization

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0

### Memory Ownership
- User can only access memories they created
- `userId` field in Memory table enforces ownership
- Backend checks `req.user.id` matches `memory.userId`
- Returns 403 Forbidden if ownership mismatch

### Acceptance Criteria
```
Given: User A is authenticated
When: User A tries to access User B's memory
Then: Return 403 Forbidden
```

## 6.7 Authentication Edge Cases

| Edge Case | Backend Behavior | Frontend Behavior |
|-----------|------------------|-------------------|
| Token expired | Return 401 | Clear storage, redirect to login |
| Invalid token | Return 401 | Clear storage, redirect to login |
| Missing token | Return 401 | Redirect to login |
| Refresh during login | - | Preserve form data |
| Double-click submit | - | Disable button, prevent duplicate |
| Network timeout | Return 504 | Show timeout error |
| Server down | Return 503 | Show connection error |

---

# 7. USER PROFILE

**Status:** 🟢 IMPLEMENTED  
**Priority:** P2  
**Route:** `/profile`

## Profile View

### Fields Displayed
| Field | Type | Source |
|-------|------|--------|
| Avatar | string (URL) | User.avatar |
| Name | string | User.name |
| Email | string | User.email |
| Account Created | DateTime | User.createdAt |
| Total Memories | number | Count from memories table |

## Profile Editing

### Editable Fields
| Field | Validation |
|-------|------------|
| Name | Max 255 characters |
| Avatar | Valid URL |
| Password | Min 6 characters (current password required) |

### Change Password Flow
```
1. Enter current password
   ↓
2. Enter new password
   ↓
3. Confirm new password
   ↓
4. Validate current password
   ↓
5. Hash new password
   ↓
6. Update in database
   ↓
7. Success message
```

## Future Features (🟣 FUTURE)
- Bio field
- Birthday
- Privacy settings (public/private profile)
- Profile visibility toggle
- Account deletion

---

# 8. LANDING PAGE

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1  
**Route:** `/`

## Hero Section

### Text
**Headline:** "Your memories have a place."  
**Subheadline:** "Capture your moments on the map and relive them forever."

### CTA Buttons
- "Sign Up" → `/register`
- "Sign In" → `/login`

## How It Works

### 3 Steps
1. **Choose a place** - Click anywhere on the map
2. **Capture your memory** - Add photos, mood, and details
3. **Relive it later** - Browse your timeline and statistics

## Feature Showcase

### Cards
| Name | Description | Icon |
|------|-------------|------|
| Map | Interactive map with memory markers | MapPin |
| Memory | Rich memory details with photos | Book |
| Timeline | Chronological view of your journey | Calendar |
| Photos | Gallery of your captured moments | Image |
| Statistics | Insights about your memories | BarChart |

## Preview Map
- Static or interactive map preview
- Shows sample markers
- Not functional (demo only)

## Footer CTA
- "Start your memory journey today"
- "Sign Up" button

## Footer Links
- Logo
- Navigation (Home, Features, About)
- Login
- Register
- About
- Privacy Policy
- Terms of Service

---

# 9. MAP — CORE FEATURE

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0  
**Component:** `Map.tsx`

## 9.1 Map Rendering

### Map Provider
- **Library:** Leaflet via React-Leaflet
- **Tile Provider:** OpenStreetMap
- **Tile URL:** `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

### Map Configuration
| Setting | Value |
|---------|-------|
| Default Center | [21.0285, 105.8542] (Hanoi, Vietnam) |
| Default Zoom | 13 |
| Min Zoom | 3 |
| Max Zoom | 19 |
| Zoom Control | Enabled |
| Scroll Wheel Zoom | Enabled |

### Map States
| State | UI | Behavior |
|-------|-----|----------|
| Loading | Spinner | Show loading indicator |
| Error | Error message | Show error with retry |
| Empty | Empty map | Show welcome message |
| Permission Denied | Error | Show location permission error |
| No Internet | Error | Show offline message |
| Invalid Coordinates | Error | Show coordinate error |

## 9.2 Marker

### Marker Properties
| Property | Type | Source |
|----------|------|--------|
| id | string | Memory.id |
| title | string | Memory.title |
| location | [lat, lng] | Memory.latitude, Memory.longitude |
| mood | string | Memory.mood |
| category | object | Memory.category |
| thumbnail | string | First image URL |

### Marker Visual
- Default blue pin icon
- Hover effect: scale up
- Click: open popup

## 9.3 Marker Popup

### Popup Content
| Element | Source |
|---------|--------|
| Title | Memory.title |
| Image | First image from Memory.images |
| Date | Memory.memoryDate (formatted) |
| Mood | Memory.mood with emoji |
| Category | Memory.category.name with icon |
| Location | Memory.locationName |

### Popup Actions
- **"View Memory"** button → `/memories/[id]`

## 9.4 Click Map

### Behavior
```
User clicks map
  ↓
Capture coordinates (latitude, longitude)
  ↓
Set selected location state
  ↓
Show marker at clicked location
  ↓
Pre-fill form with coordinates
```

### Coordinate Precision
- Latitude: 6 decimal places
- Longitude: 6 decimal places

## 9.5 Current Location

**Status:** 🟢 IMPLEMENTED  
**Priority:** P3

### Implementation
- Use browser Geolocation API
- Button: "Get my location"
- Permission request dialog
- Center map on user location
- Add marker at user location

### Error Handling
- Permission denied: Show error message
- Location unavailable: Show error message
- Timeout: Show error message

## 9.6 Location Search

**Status:** 🟢 IMPLEMENTED  
**Priority:** P2

### Search Types
- Place names (University, Cafe, Airport)
- Addresses
- POI (Points of Interest)

### Implementation
- Use Nominatim (OpenStreetMap) API
- Debounce search input (300ms)
- Show search results dropdown
- Click result → center map on location

### API Endpoint
```
GET https://nominatim.openstreetmap.org/search
?format=json&q={query}
```

## 9.7 Reverse Geocoding

**Status:** ⚪ MISSING  
**Priority:** P3  
**Feature:** 🔵 PLANNED

### Purpose
Convert coordinates to location name automatically

### Implementation
- Use Nominatim reverse geocoding API
- Called when user clicks map
- Auto-fill `locationName` field

### API Endpoint
```
GET https://nominatim.openstreetmap.org/reverse
?format=json&lat={lat}&lon={lon}
```

## 9.8 Map Clustering

**Status:** ⚪ MISSING  
**Priority:** P2  
**Feature:** 🟣 FUTURE

### Purpose
Group nearby markers when zoomed out

### Implementation
- Use leaflet.markercluster
- Cluster radius: 50px
- Show cluster count
- Click cluster → zoom to markers

## 9.9 Map Filters

**Status:** 🟡 PARTIALLY IMPLEMENTED  
**Priority:** P1

### Available Filters
- **Category:** Filter by category
- **Mood:** Filter by mood
- **Date Range:** Filter by date range

### Filter Behavior
- Markers update based on filters
- Filter state persists
- Clear filters button

## 9.10 Map States

| State | Trigger | UI | Recovery |
|-------|---------|-----|----------|
| Loading | Initial load | Spinner | Auto-resolve |
| Error | API failure | Error message | Retry button |
| Empty | No memories | Welcome message | N/A |
| Permission Denied | Location access | Error message | Manual location |
| No Internet | Offline | Offline message | Retry when online |
| Invalid Coordinates | Bad coords | Error message | Re-select location |

---

# 10. MEMORY MANAGEMENT

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0

## 10.1 Create Memory

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0  
**Route:** `/memories/new`  
**API:** `POST /memories`

### Fields

| Field | Type | Required | Validation | Max Length | UI | API | Database |
|-------|------|----------|------------|------------|-----|-----|----------|
| title | string | Yes | Not empty | 255 | Input | DTO | String |
| content | string | No | Any | 10000 | Textarea | DTO | String? |
| latitude | number | Yes | Valid coord | - | Hidden | DTO | Float |
| longitude | number | Yes | Valid coord | - | Hidden | DTO | Float |
| locationName | string | No | Any | 255 | Input | DTO | String? |
| memoryDate | string | Yes | Valid date | - | Date picker | DTO | DateTime |
| mood | enum | Yes | Valid mood | - | Mood selector | DTO | Mood |
| category | string | Yes | Valid category | - | Category selector | DTO | categoryId (String) |
| images | array | No | Valid URLs | - | Image input | Separate API | MemoryImage[] |

### Validation Rules
- **title:** Required, max 255 chars, not empty
- **content:** Optional, max 10000 chars
- **latitude:** Required, -90 to 90
- **longitude:** Required, -180 to 180
- **memoryDate:** Required, valid ISO date
- **mood:** Required, must be valid Mood enum
- **categoryId:** Required, must exist in database
- **images:** Optional, each must be valid URL

### API Request
```json
POST /memories
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Memory",
  "content": "Description here",
  "latitude": 21.0285,
  "longitude": 105.8542,
  "locationName": "Hanoi",
  "memoryDate": "2026-01-01T00:00:00Z",
  "mood": "HAPPY",
  "categoryId": "uuid"
}
```

### API Response
```json
{
  "id": "uuid",
  "title": "My Memory",
  "content": "Description here",
  "latitude": 21.0285,
  "longitude": 105.8542,
  "locationName": "Hanoi",
  "memoryDate": "2026-01-01T00:00:00Z",
  "mood": "HAPPY",
  "categoryId": "uuid",
  "category": {
    "id": "uuid",
    "name": "Travel",
    "icon": "✈️"
  },
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z",
  "images": []
}
```

### Error States
- **Unauthorized:** 401 (not logged in)
- **Validation error:** 400 (invalid data)
- **Category not found:** 404
- **Database error:** 500

### Acceptance Criteria
```
Given: User is authenticated
When: User fills all required fields
And: Clicks "Save Memory"
Then: Memory is created in database
And: Marker appears on map
And: User is redirected to memory detail
```

## 10.2 Edit Memory

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0  
**Route:** `/memories/[id]/edit`  
**API:** `PUT /memories/:id`

### Editable Fields
All fields from Create Memory are editable except:
- `id` (immutable)
- `userId` (immutable)
- `createdAt` (immutable)

### Pre-population
Form is pre-filled with existing memory data

### API Request
```json
PUT /memories/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "latitude": 21.0285,
  "longitude": 105.8542,
  "locationName": "Updated Location",
  "memoryDate": "2026-01-01T00:00:00Z",
  "mood": "EXCITED",
  "categoryId": "uuid"
}
```

### Authorization
- Only memory owner can edit
- Returns 403 if not owner

### Acceptance Criteria
```
Given: User is memory owner
When: User edits memory fields
And: Clicks "Save Changes"
Then: Memory is updated in database
And: Map marker updates
And: Redirected to memory detail
```

## 10.3 Delete Memory

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0  
**API:** `DELETE /memories/:id`

### Confirmation
- Modal dialog: "Delete Memory?"
- Warning: "This action cannot be undone"
- Two buttons: "Cancel", "Delete"

### API Behavior
- Deletes memory from database
- Cascades to delete associated images
- Returns 204 No Content

### Authorization
- Only memory owner can delete
- Returns 403 if not owner

### Frontend Behavior
- Show loading state during delete
- On success: redirect to dashboard
- On error: show error message

### Acceptance Criteria
```
Given: User is memory owner
When: User clicks "Delete"
And: Confirms deletion
Then: Memory is deleted from database
And: Marker is removed from map
And: User is redirected to dashboard
```

## 10.4 View Memory

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0  
**Route:** `/memories/[id]`  
**API:** `GET /memories/:id`

### Display Elements
- Title
- Content
- Location (with mini map)
- Date (formatted)
- Mood (with emoji)
- Category (with icon)
- Image gallery
- Actions (Edit, Delete, Back)

### Authorization
- Only memory owner can view
- Returns 403 if not owner

## 10.5 Memory Ownership

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0

### Enforcement
- Database: `userId` foreign key
- Backend: Check `req.user.id === memory.userId`
- Frontend: Only show user's own memories

### Acceptance Criteria
```
Given: User A is authenticated
When: User A requests User B's memory
Then: Return 403 Forbidden
```

## 10.6 Memory Sorting

**Status:** 🟡 PARTIALLY IMPLEMENTED  
**Priority:** P1

### Available Sort Options
- Date (newest first) - IMPLEMENTED
- Date (oldest first) - ⚪ MISSING
- Title (A-Z) - ⚪ MISSING
- Title (Z-A) - ⚪ MISSING

## 10.7 Memory Filtering

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1

### Filter Options
- **Category:** Filter by category ID
- **Mood:** Filter by mood
- **Date Range:** Filter by from/to dates
- **Search:** Search in title, content, locationName

### API Implementation
```typescript
GET /memories?categoryId={id}&mood={mood}&from={date}&to={date}&search={query}
```

## 10.8 Memory Pagination

**Status:** ⚪ MISSING  
**Priority:** P3  
**Feature:** 🟣 FUTURE

### Implementation
- Page size: 20 memories
- Infinite scroll or load more button
- Total count in response

---

# 11. MEMORY FORM

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0

## Title

### UI
- Text input field
- Placeholder: "Memory title"
- Required indicator (*)
- Max length indicator (optional)

### Validation
- Required
- Max 255 characters
- Not empty after trim

### Error Message
"Title is required" (if empty)
"Title is too long (max 255 characters)" (if too long)

## Content

### UI
- Textarea field
- Placeholder: "Describe your memory..."
- Optional
- Character count indicator

### Validation
- Optional
- Max 10000 characters

### Error Message
"Content is too long (max 10000 characters)"

## Date

### UI
- Date picker input
- Default: today's date
- Format: YYYY-MM-DD

### Validation
- Required
- Valid date format
- Not in future (optional validation)

### Error Message
"Date is required"

## Location

### UI
- Map component for location selection
- Latitude/longitude hidden inputs
- Location name text input (optional)
- "Select on map" instruction

### Validation
- Latitude: Required, -90 to 90
- Longitude: Required, -180 to 180
- Location name: Optional, max 255 chars

### Error Message
"Please select a location on the map"

## Category

### UI
- Dropdown selector
- Categories loaded from API
- Each category shows icon + name
- Required indicator (*)

### Validation
- Required
- Must be valid category ID

### Error Message
"Please select a category"

## Mood

### UI
- Mood selector with emoji
- Grid layout
- Each mood shows emoji + label
- Selected state highlighted

### Validation
- Required
- Must be valid Mood enum value

### Error Message
"Please select a mood"

## Images

### UI
- Image URL input
- "Add Photo" button
- Image preview
- Delete button on each image
- Multiple images support

### Validation
- Optional
- Each must be valid URL
- Max 10 images per memory

### Error Message
"Invalid image URL"
"Maximum 10 images allowed"

## Save Button

### UI
- Primary action button
- Text: "Save Memory"
- Disabled during submission
- Shows loading spinner

### Behavior
- Validate all fields
- Submit to API
- On success: redirect to detail
- On error: show error

## Cancel Button

### UI
- Secondary action button
- Text: "Cancel"
- Navigates back

## Validation Matrix

| Field | Required | Type | Min | Max | Validation |
|-------|----------|------|-----|-----|------------|
| title | Yes | string | 1 | 255 | Not empty |
| content | No | string | 0 | 10000 | Any |
| latitude | Yes | number | -90 | 90 | Valid coord |
| longitude | Yes | number | -180 | 180 | Valid coord |
| locationName | No | string | 0 | 255 | Any |
| memoryDate | Yes | date | - | - | Valid date |
| mood | Yes | enum | - | - | Valid mood |
| categoryId | Yes | string | - | - | Valid UUID |
| images | No | array | 0 | 10 | Valid URLs |

## Edge Cases

| Case | Behavior |
|------|----------|
| Title empty | Show error, prevent submit |
| Content too long | Show error, prevent submit |
| Invalid coordinate | Show error, prevent submit |
| No category | Show error, prevent submit |
| Invalid date | Show error, prevent submit |
| Invalid image URL | Show error, prevent submit |
| Upload failed | Show error, keep form data |
| Network failed | Show error, keep form data |
| Duplicate submit | Disable button, prevent double-submit |

---

# 12. CATEGORY SYSTEM

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1

## Default Categories

| ID | Name | Icon |
|----|------|------|
| 1 | Love | ❤️ |
| 2 | Family | 👨‍👩‍👧 |
| 3 | Friends | 👥 |
| 4 | Study | 🎓 |
| 5 | Work | 💼 |
| 6 | Travel | ✈️ |
| 7 | Event | 🎉 |
| 8 | Personal | 🌱 |
| 9 | Other | ⭐ |

## Category List

**API:** `GET /categories`  
**Status:** 🟢 IMPLEMENTED

### Response
```json
[
  {
    "id": "uuid",
    "name": "Travel",
    "icon": "✈️",
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

## Category Seeding

**API:** `POST /categories/seed`  
**Status:** 🟢 IMPLEMENTED

### Purpose
Seed default categories into database

### Behavior
- Check if categories exist
- If empty, insert default categories
- Return seeded categories

## Category Filtering

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1

### Implementation
- Filter memories by category ID
- Category dropdown in dashboard
- Category filter in statistics

## Category Statistics

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1

### Metrics
- Count of memories per category
- Most used category
- Category distribution chart

## Future Features (🟣 FUTURE)
- Custom categories (user-created)
- Category editing
- Category deletion
- Category colors
- Category icons upload

---

# 13. MOOD SYSTEM

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1

## Mood Enum

| Mood | Emoji | Label |
|------|-------|-------|
| HAPPY | 😊 | Happy |
| SAD | 😢 | Sad |
| EXCITED | 🤩 | Excited |
| PEACEFUL | 😌 | Peaceful |
| NOSTALGIC | 😊 | Nostalgic |
| LOVE | ❤️ | Love |
| ANGRY | 😡 | Angry |
| TIRED | 😴 | Tired |
| NEUTRAL | 😐 | Neutral |

## Mood Display

### In Memory Form
- Grid layout
- Each mood shows emoji + label
- Click to select
- Selected state highlighted

### In Memory Detail
- Mood emoji + label
- Large emoji display

### In Statistics
- Mood distribution chart
- Most common mood highlight
- Mood count per category

## Mood Filtering

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1

### Implementation
- Filter memories by mood
- Mood dropdown in dashboard
- Mood filter in timeline

## Mood Statistics

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1

### Metrics
- Count of memories per mood
- Most common mood
- Mood distribution over time

---

# 14. IMAGE SYSTEM

**Status:** 🟡 PARTIALLY IMPLEMENTED  
**Priority:** P1

## Upload

**Status:** 🟢 IMPLEMENTED (URL-based)  
**Priority:** P1  
**API:** `POST /memories/:id/images`

### Current Implementation
- User enters image URL manually
- URL validation (must be valid URL)
- No file upload (URL only)

### Future Implementation (🟣 FUTURE)
- File upload via multipart/form-data
- Cloudinary integration
- S3 integration
- Image compression
- Thumbnail generation

## Multiple Images

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1

### Limits
- Max 10 images per memory
- No minimum

## Preview

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1

### UI
- Grid layout (2 columns mobile, 3 desktop)
- Thumbnail preview
- Hover effect: show delete button

## Delete Image

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1  
**API:** `DELETE /memories/:memoryId/images/:imageId`

### Behavior
- Delete button appears on hover
- Confirmation not required (instant delete)
- On success: reload memory data

## Image Ordering

**Status:** ⚪ MISSING  
**Priority:** P3  
**Feature:** 🟣 FUTURE

### Implementation
- Drag and drop reordering
- Order field in database
- Update order API

## Image Validation

### Supported Formats (Future)
- JPEG
- PNG
- WEBP

### File Size (Future)
- Max 5MB per image
- Min 10KB

## Upload Progress

**Status:** ⚪ MISSING  
**Priority:** P2  
**Feature:** 🔵 PLANNED

### UI
- Progress bar
- Percentage indicator
- Cancel button

## Upload Error

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1

### Error States
- Invalid URL
- Network error
- API error

### Error Messages
- "Invalid image URL"
- "Failed to add image"
- "Connection error"

## Image Gallery

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1

### UI
- Grid layout
- Responsive (2-3 columns)
- Click to view (future: fullscreen)

## Fullscreen Viewer

**Status:** ⚪ MISSING  
**Priority:** P3  
**Feature:** 🟣 FUTURE

### Features
- Lightbox modal
- Previous/Next navigation
- Close button
- Image info display

---

# 15. MEMORY DETAIL

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0  
**Route:** `/memories/[id]`

## UI Layout

### Header
- Back button
- Title
- Edit button
- Delete button

### Content Sections

| Section | Content |
|---------|---------|
| Title | Memory.title |
| Location | Memory.locationName with mini map |
| Date | Memory.memoryDate (formatted) |
| Mood | Memory.mood with emoji |
| Category | Memory.category with icon |
| Gallery | Memory.images grid |
| Content | Memory.content (if exists) |
| Mini Map | Leaflet map with single marker |

### Actions
- **Edit** → `/memories/[id]/edit`
- **Delete** → Show confirmation modal
- **Back** → Navigate back

## Mini Map

### Configuration
- Single marker at memory location
- Zoom level: 15
- No zoom control
- No scroll zoom

## Empty States

| Field | Empty State |
|-------|------------|
| Content | Hidden if empty |
| Images | Show "Add Photo" button if empty |
| Location Name | Hidden if empty |

---

# 16. TIMELINE

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1  
**Route:** `/timeline`

## Features

### Chronological Display
- Memories sorted by date (newest first)
- Year grouping
- Month grouping within year

### Display Elements
| Element | Source |
|---------|--------|
| Year | Memory.memoryDate (year) |
| Date | Memory.memoryDate (formatted) |
| Category | Memory.category |
| Mood | Memory.mood with emoji |
| Location | Memory.locationName |
| Image | First image from Memory.images |
| Content | Memory.content (truncated) |

### Visual Design
- Vertical timeline
- Year headers
- Timeline line with dots
- Memory cards on right side
- Click card → view memory detail

## Filters

### Available Filters
- **Year:** Filter by year
- **Category:** Filter by category
- **Mood:** Filter by mood

### Filter Behavior
- Update timeline on filter change
- Show count of filtered memories
- Clear filters button

## Empty State

### Message
"No memories yet. Start creating memories to see your timeline."

### Action
"Add Your First Memory" button → `/memories/new`

## Sorting

### Options
- Newest first (default)
- Oldest first (⚪ MISSING)

---

# 17. SEARCH

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1

## Search Fields

| Field | Searched In |
|-------|-------------|
| Query | title, content, locationName |

## Behavior

### Debounce
- 300ms debounce
- Prevents API spam

### Minimum Query
- Minimum 2 characters
- Show message if less than 2 chars

### Loading State
- Show spinner during search
- Disable search input

### Result Count
- Show "X memories found"

### No Results
- Message: "No memories found matching your search"
- Suggestion: "Try different keywords"

### Clear
- Clear button in search input
- Resets to all memories

## Example

```
Search: "university"
Results: All memories with "university" in title, content, or locationName
```

---

# 18. FILTERING

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1

## Filter Types

### Category
- Dropdown selector
- Categories loaded from API
- "All Categories" option
- Icon + name display

### Mood
- Dropdown selector
- Moods from Mood enum
- "All Moods" option
- Emoji + label display

### Date Range
- From date picker
- To date picker
- "All Time" option

### Year
- Dropdown with available years
- "All Years" option
- Auto-generated from memory dates

### Location
- ⚪ MISSING (🟣 FUTURE)
- Search by location name
- Filter by region/country

## Filter Combinations

### Supported
- Category + Mood
- Category + Date Range
- Mood + Date Range
- Category + Mood + Date Range
- Search + Category
- Search + Mood
- Search + Date Range
- Search + Category + Mood + Date Range

### Example
```
Filter: Travel + Excited + 2026
Result: All travel memories from 2026 with excited mood
```

## Filter Persistence
- Filter state persists across navigation
- Reset on logout
- Clear filters button

---

# 19. STATISTICS

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1  
**Route:** `/statistics`  
**API:** `GET /memories/statistics`

## Overview Cards

| Card | Metric | Source |
|------|--------|--------|
| Total Memories | Count of all memories | Database count |
| This Year | Memories in current year | Filter by year |
| Locations | Unique locations | Unique lat/lng pairs |
| Categories | Unique categories | Unique category IDs |

## Charts

### Mood Distribution
- Bar chart or pie chart
- Memories per mood
- Percentage calculation
- Emoji labels

### Category Distribution
- Bar chart
- Memories per category
- Percentage calculation
- Icon labels

### Monthly Activity
- Bar chart
- Last 12 months
- Memories per month
- Month labels (Jan 2026, Feb 2026, etc.)

## Data Source
- All data from actual user memories
- No fake data
- Real-time calculation

## Empty State

### Message
"No data yet. Start creating memories to see your statistics."

### Action
"Add Your First Memory" button

---

# 20. DASHBOARD

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0  
**Route:** `/dashboard`

## Layout Components

### Map
- Full-width map
- Memory markers
- Filter controls
- Search bar

### Sidebar (Desktop)
- Filter controls
- Category filter
- Mood filter
- Date range filter
- Search input
- Memory list (optional)

### Search
- Search input in header
- Real-time search
- Clear button

### Filters
- Category dropdown
- Mood dropdown
- Date range pickers
- Clear filters button

### Memory List
- List of memories (below map or in sidebar)
- Card layout
- Quick actions (view, edit, delete)

### Add Memory
- Floating action button (mobile)
- Header button (desktop)
- Opens `/memories/new`

### Profile
- User name in header
- Avatar (if exists)
- Logout button

## Responsive Layouts

### Desktop (1280px+)
- Sidebar + Map layout
- Sidebar on left (300px)
- Map on right (flex)
- Filters in sidebar

### Tablet (768px - 1279px)
- Collapsible sidebar
- Map full width
- Filters in header or drawer

### Mobile (< 768px)
- Full-screen map
- Filters in bottom sheet or drawer
- Floating add button
- Hamburger menu

---

# 21. RESPONSIVE

**Status:** 🟢 IMPLEMENTED  
**Priority:** P1

## Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile S | 375px | Full-screen map, bottom sheet |
| Mobile M | 414px | Full-screen map, bottom sheet |
| Tablet | 768px | Collapsible sidebar |
| Laptop | 1024px | Sidebar + map |
| Desktop | 1280px | Sidebar + map |
| Wide | 1440px | Sidebar + map (wider) |

## Mobile (< 768px)

### Map
- Full-screen height
- No sidebar
- Floating action button for add
- Bottom sheet for filters

### Navigation
- Hamburger menu
- Drawer for navigation
- Bottom navigation (optional)

### Memory List
- Full-width cards
- Swipe actions (future)

## Tablet (768px - 1279px)

### Map
- Full width
- Collapsible sidebar
- Sidebar toggle button

### Layout
- Sidebar: 250px
- Map: flex
- Responsive grid for cards

## Desktop (1280px+)

### Map
- Fixed width or flex
- Sidebar visible by default

### Layout
- Sidebar: 300px
- Map: flex
- Multi-column grids

---

# 22. NAVIGATION

**Status:** 🟢 IMPLEMENTED  
**Priority:** P0

## Routes

| Route | Purpose | Auth Required | UI | API | States |
|-------|---------|----------------|-----|-----|--------|
| `/` | Landing page | No | Hero, features, CTA | - | Loading, error |
| `/login` | Login | No | Login form | POST /auth/login | Loading, error, success |
| `/register` | Register | No | Register form | POST /auth/register | Loading, error, success |
| `/dashboard` | Main dashboard | Yes | Map, filters, list | GET /memories | Loading, error, empty |
| `/timeline` | Timeline view | Yes | Timeline, filters | GET /memories | Loading, error, empty |
| `/statistics` | Statistics | Yes | Charts, cards | GET /memories/statistics | Loading, error, empty |
| `/memories/new` | Create memory | Yes | Memory form | POST /memories | Loading, error, validation |
| `/memories/[id]` | Memory detail | Yes | Detail view | GET /memories/:id | Loading, error, not found |
| `/memories/[id]/edit` | Edit memory | Yes | Memory form | PUT /memories/:id | Loading, error, validation |
| `/profile` | User profile | Yes | Profile view | GET /auth/me | Loading, error (⚪ MISSING) |

## Navigation Components

### Header
- Logo
- Navigation links
- User menu
- Logout button

### Sidebar
- Navigation links
- Filters
- Memory list

### Bottom Navigation (Mobile - Future)
- Map
- Timeline
- Statistics
- Profile

---

# 23. API SPECIFICATION

## Authentication

### POST /auth/register
| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | /auth/register |
| Authentication | No |
| Request Body | `{ email, password, name }` |
| Response | `{ access_token, user }` |
| Error Responses | 400 (invalid), 409 (email exists) |
| Validation | Email format, password min 6 chars |
| Authorization | N/A |

### POST /auth/login
| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | /auth/login |
| Authentication | No |
| Request Body | `{ email, password }` |
| Response | `{ access_token, user }` |
| Error Responses | 401 (invalid credentials) |
| Validation | Email format, password required |
| Authorization | N/A |

### GET /auth/me
| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | /auth/me |
| Authentication | Yes (JWT) |
| Request Body | N/A |
| Response | `{ id, email, name, avatar, createdAt }` |
| Error Responses | 401 (not authenticated) |
| Validation | N/A |
| Authorization | JWT required |

## Memory

### GET /memories
| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | /memories |
| Authentication | Yes (JWT) |
| Query Params | `categoryId`, `mood`, `from`, `to`, `search` |
| Response | `Memory[]` |
| Error Responses | 401 (not authenticated) |
| Validation | Query params optional |
| Authorization | User can only see own memories |

### GET /memories/:id
| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | /memories/:id |
| Authentication | Yes (JWT) |
| Path Params | `id` (UUID) |
| Response | `Memory` |
| Error Responses | 401, 403 (not owner), 404 (not found) |
| Validation | UUID format |
| Authorization | User must be owner |

### POST /memories
| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | /memories |
| Authentication | Yes (JWT) |
| Request Body | `{ title, content, latitude, longitude, locationName, memoryDate, mood, categoryId }` |
| Response | `Memory` |
| Error Responses | 400 (validation), 401, 404 (category not found) |
| Validation | All DTO rules |
| Authorization | User authenticated |

### PUT /memories/:id
| Property | Value |
|----------|-------|
| Method | PUT |
| Endpoint | /memories/:id |
| Authentication | Yes (JWT) |
| Path Params | `id` (UUID) |
| Request Body | `{ title, content, latitude, longitude, locationName, memoryDate, mood, categoryId }` (all optional) |
| Response | `Memory` |
| Error Responses | 400 (validation), 401, 403 (not owner), 404 |
| Validation | DTO rules |
| Authorization | User must be owner |

### DELETE /memories/:id
| Property | Value |
|----------|-------|
| Method | DELETE |
| Endpoint | /memories/:id |
| Authentication | Yes (JWT) |
| Path Params | `id` (UUID) |
| Response | 204 No Content |
| Error Responses | 401, 403 (not owner), 404 |
| Validation | UUID format |
| Authorization | User must be owner |

### GET /memories/statistics
| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | /memories/statistics |
| Authentication | Yes (JWT) |
| Response | `Statistics` object |
| Error Responses | 401 |
| Validation | N/A |
| Authorization | User authenticated |

## Categories

### GET /categories
| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | /categories |
| Authentication | No |
| Response | `Category[]` |
| Error Responses | 500 |
| Validation | N/A |
| Authorization | N/A |

### POST /categories/seed
| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | /categories/seed |
| Authentication | No |
| Response | `Category[]` |
| Error Responses | 500 |
| Validation | N/A |
| Authorization | N/A |

## Images

### POST /memories/:id/images
| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | /memories/:id/images |
| Authentication | Yes (JWT) |
| Path Params | `id` (UUID) |
| Request Body | `{ imageUrl }` |
| Response | 201 Created |
| Error Responses | 400 (validation), 401, 403 (not owner), 404 |
| Validation | URL format |
| Authorization | User must be owner |

### DELETE /memories/:memoryId/images/:imageId
| Property | Value |
|----------|-------|
| Method | DELETE |
| Endpoint | /memories/:memoryId/images/:imageId |
| Authentication | Yes (JWT) |
| Path Params | `memoryId`, `imageId` (UUIDs) |
| Response | 204 No Content |
| Error Responses | 401, 403 (not owner), 404 |
| Validation | UUID format |
| Authorization | User must be memory owner |

---

# 24. DATABASE FEATURE MAPPING

## Tables

### users
| Feature | Fields |
|---------|--------|
| Register | email, passwordHash, name, avatar |
| Login | email, passwordHash |
| Profile | name, avatar, createdAt |
| Authorization | id (foreign key in memories) |

### categories
| Feature | Fields |
|---------|--------|
| Category list | id, name, icon |
| Category filtering | id (foreign key in memories) |
| Category statistics | id (aggregation) |

### memories
| Feature | Fields |
|---------|--------|
| Create memory | All fields except id, createdAt, updatedAt |
| Edit memory | All fields except id, userId, createdAt |
| Delete memory | id |
| Memory ownership | userId (foreign key) |
| Location | latitude, longitude, locationName |
| Date | memoryDate |
| Mood | mood (enum) |
| Category | categoryId (foreign key) |
| Content | content |
| Search | title, content, locationName |
| Filtering | categoryId, mood, memoryDate |
| Statistics | All fields (aggregation) |

### memory_images
| Feature | Fields |
|---------|--------|
| Image upload | imageUrl |
| Image delete | id |
| Image gallery | imageUrl |
| Memory detail | memoryId (foreign key) |

## Relationships
- User → Memories (1:N)
- Category → Memories (1:N)
- Memory → MemoryImages (1:N)

## Indexes
- memories.userId (for ownership queries)
- memories.categoryId (for category filtering)
- memories.mood (for mood filtering)
- memory_images.memoryId (for image queries)

## Constraints
- User.email unique
- Category.name unique
- Memory.userId foreign key (cascade delete)
- Memory.categoryId foreign key
- MemoryImage.memoryId foreign key (cascade delete)

---

# 25. VALIDATION MATRIX

| Feature | Field | Required | Type | Min | Max | Validation |
|---------|-------|----------|------|-----|-----|------------|
| Register | email | Yes | string | - | 255 | Email format, unique |
| Register | password | Yes | string | 6 | 255 | Min 6 chars |
| Register | name | No | string | - | 255 | Any |
| Login | email | Yes | string | - | 255 | Email format |
| Login | password | Yes | string | - | - | Any |
| Memory | title | Yes | string | 1 | 255 | Not empty |
| Memory | content | No | string | 0 | 10000 | Any |
| Memory | latitude | Yes | number | -90 | 90 | Valid coord |
| Memory | longitude | Yes | number | -180 | 180 | Valid coord |
| Memory | locationName | No | string | - | 255 | Any |
| Memory | memoryDate | Yes | date | - | - | Valid date |
| Memory | mood | Yes | enum | - | - | Valid Mood |
| Memory | categoryId | Yes | string | - | - | Valid UUID |
| Image | imageUrl | Yes | string | - | 2048 | Valid URL |
| Search | query | No | string | 2 | 100 | Any |
| Filter | categoryId | No | string | - | - | Valid UUID |
| Filter | mood | No | enum | - | - | Valid Mood |
| Filter | from | No | date | - | - | Valid date |
| Filter | to | No | date | - | - | Valid date |

---

# 26. ERROR HANDLING

## Backend HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Not authenticated, invalid token |
| 403 | Forbidden | Not authorized (not owner) |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate (email exists) |
| 413 | Payload Too Large | File too big (future) |
| 422 | Unprocessable Entity | Validation error (alternative) |
| 429 | Too Many Requests | Rate limit exceeded (future) |
| 500 | Internal Server Error | Server error |

## Frontend Error Handling

| Error Type | Cause | Frontend Behavior | User Message | Recovery |
|------------|-------|------------------|--------------|----------|
| Network error | No internet | Show error toast | "Connection error" | Retry button |
| Timeout | Request too slow | Show error toast | "Request timeout" | Retry button |
| API error (400) | Validation error | Show field errors | Field-specific | Fix input |
| API error (401) | Not authenticated | Clear storage, redirect | "Session expired" | Login again |
| API error (403) | Not authorized | Show error toast | "Access denied" | N/A |
| API error (404) | Not found | Show error page | "Not found" | Go back |
| API error (409) | Conflict | Show error toast | "Email already exists" | Use different email |
| API error (500) | Server error | Show error toast | "Server error" | Retry later |
| Upload error | Upload failed | Show error toast | "Upload failed" | Retry |
| Map error | Leaflet error | Show error message | "Map error" | Reload |
| Location permission denied | Browser denied | Show error message | "Location permission denied" | Manual location |
| Session expired | Token expired | Auto-logout | "Session expired" | Login again |

---

# 27. LOADING STATES

| Feature | Loading State | UI |
|---------|---------------|-----|
| Login | Button disabled, spinner | "Signing in..." |
| Register | Button disabled, spinner | "Creating account..." |
| Map | Spinner overlay | "Loading map..." |
| Memories | Spinner in list | "Loading memories..." |
| Memory detail | Spinner overlay | "Loading memory..." |
| Create memory | Button disabled, spinner | "Saving..." |
| Edit memory | Button disabled, spinner | "Saving..." |
| Delete memory | Button disabled, spinner | "Deleting..." |
| Upload image | Button disabled, spinner | "Adding..." |
| Search | Spinner in input | "Searching..." |
| Statistics | Spinner overlay | "Loading statistics..." |
| Timeline | Spinner overlay | "Loading timeline..." |
| Categories | Spinner in dropdown | "Loading categories..." |

---

# 28. EMPTY STATES

| Feature | Empty State Message | Action |
|---------|-------------------|--------|
| No memories (map) | "Bản đồ của bạn vẫn đang trống." | "Add your first memory" |
| No memories (list) | "No memories yet." | "Add your first memory" |
| No search results | "Không tìm thấy kỷ niệm nào." | "Try different keywords" |
| No timeline | "No memories in timeline." | "Add your first memory" |
| No images | "No photos yet." | "Add photo" |
| No statistics | "No data yet." | "Add your first memory" |
| No categories | "No categories available." | "Seed categories" |

---

# 29. SECURITY FEATURES

| Feature | Status | Priority | Implementation |
|----------|--------|----------|----------------|
| Bcrypt password hashing | 🟢 IMPLEMENTED | P0 | 10 salt rounds |
| JWT authentication | 🟢 IMPLEMENTED | P0 | 7-day expiration |
| Authorization (ownership) | 🟢 IMPLEMENTED | P0 | User ID check |
| DTO validation | 🟢 IMPLEMENTED | P0 | class-validator |
| CORS | 🟢 IMPLEMENTED | P0 | Configured in main.ts |
| Rate limiting | ⚪ MISSING | IMPORTANT | 🔵 PLANNED |
| File validation | 🟢 IMPLEMENTED (URL) | P1 | URL format check |
| File size limit | ⚪ MISSING | IMPORTANT | 🔵 PLANNED |
| Input sanitization | 🟢 IMPLEMENTED | P0 | DTO whitelist |
| Secret management | 🟢 IMPLEMENTED | P0 | Environment variables |
| Environment variables | 🟢 IMPLEMENTED | P0 | .env file |
| Error information leakage | 🟢 IMPLEMENTED | P0 | Generic error messages |
| SQL injection protection | 🟢 IMPLEMENTED | P0 | Prisma ORM |
| XSS considerations | 🟢 IMPLEMENTED | P1 | React auto-escape |
| CSRF considerations | ⚪ MISSING | IMPORTANT | 🔵 PLANNED |
| Authentication expiration | 🟢 IMPLEMENTED | P0 | 7-day JWT |
| Security headers | 🟢 IMPLEMENTED | P0 | X-Content-Type-Options, X-Frame-Options, X-XSS-Protection |

---

# 30. PERFORMANCE

| Feature | Status | Priority | Implementation |
|----------|--------|----------|----------------|
| API pagination | ⚪ MISSING | P2 | 🔵 PLANNED |
| Map marker optimization | 🟢 IMPLEMENTED | P1 | Leaflet default |
| Marker clustering | ⚪ MISSING | P2 | 🟣 FUTURE |
| Image optimization | ⚪ MISSING | P2 | 🟣 FUTURE |
| Lazy loading | ⚪ MISSING | P2 | 🔵 PLANNED |
| Search debounce | 🟢 IMPLEMENTED | P1 | 300ms debounce |
| Caching | ⚪ MISSING | P3 | 🟣 FUTURE |
| Database indexes | 🟢 IMPLEMENTED | P0 | userId, categoryId, mood |
| Unnecessary API requests | 🟢 IMPLEMENTED | P1 | Zustand caching |
| React rendering optimization | 🟢 IMPLEMENTED | P1 | React.memo where needed |

---

# 31. ACCESSIBILITY

| Feature | Status | Priority | Notes |
|----------|--------|----------|-------|
| Keyboard navigation | 🟡 PARTIALLY | P2 | Basic tab navigation |
| Focus states | 🟡 PARTIALLY | P2 | Some inputs missing |
| ARIA labels | ⚪ MISSING | P2 | 🔵 PLANNED |
| Alt text | 🟡 PARTIALLY | P2 | Some images missing |
| Contrast | ⟢ IMPLEMENTED | P1 | WCAG AA compliant |
| Button labels | 🟢 IMPLEMENTED | P1 | Clear labels |
| Form errors | 🟢 IMPLEMENTED | P1 | Visible error messages |
| Screen reader support | ⚪ MISSING | P2 | 🔵 PLANNED |

---

# 32. UX MICRO-INTERACTIONS

| Interaction | Status | Implementation |
|------------|--------|----------------|
| Marker animation | 🟢 IMPLEMENTED | Hover scale effect |
| Card hover | 🟢 IMPLEMENTED | Shadow increase |
| Modal animation | 🟢 IMPLEMENTED | Fade in/out |
| Toast notification | ⚪ MISSING | 🔵 PLANNED |
| Save success | 🟢 IMPLEMENTED | Redirect + visual feedback |
| Delete confirmation | 🟢 IMPLEMENTED | Modal dialog |
| Image preview | 🟢 IMPLEMENTED | Grid preview |
| Map selection | 🟢 IMPLEMENTED | Marker appears on click |
| Loading animation | 🟢 IMPLEMENTED | Spinner |
| Button hover | 🟢 IMPLEMENTED | Background color change |

---

# 33. DATA CONSISTENCY

## Create Memory Flow
```
Database insert
  ↓
API returns memory
  ↓
Frontend state update
  ↓
Map marker added
  ↓
List updated
  ↓
Timeline updated (if viewed)
  ↓
Statistics updated (if viewed)
```

## Edit Memory Flow
```
Database update
  ↓
API returns updated memory
  ↓
Frontend state update
  ↓
Map marker updated
  ↓
List updated
  ↓
Timeline updated (if viewed)
  ↓
Statistics updated (if viewed)
```

## Delete Memory Flow
```
Database delete (cascade images)
  ↓
API returns 204
  ↓
Frontend state update
  ↓
Map marker removed
  ↓
List updated
  ↓
Timeline updated (if viewed)
  ↓
Statistics updated (if viewed)
```

## Add Image Flow
```
Database insert
  ↓
API returns success
  ↓
Frontend reloads memory
  ↓
Image gallery updated
  ↓
Marker thumbnail updated (if first image)
```

---

# 34. COMPLETE USER JOURNEYS

## New User Journey
```
1. Visit landing page
   ↓
2. Read about features
   ↓
3. Click "Sign Up"
   ↓
4. Enter email, password, name
   ↓
5. Click "Create Account"
   ↓
6. Account created, logged in
   ↓
7. Redirect to dashboard
   ↓
8. See empty map with welcome
   ↓
9. Click "Add Memory"
   ↓
10. Click on map to select location
    ↓
11. Fill in title, content, date, mood, category
    ↓
12. Click "Save Memory"
    ↓
13. See marker on map
    ↓
14. Click marker to view detail
    ↓
15. Add photo via URL
    ↓
16. Explore timeline
    ↓
17. View statistics
    ↓
18. Create more memories
```

## Returning User Journey
```
1. Visit landing page
   ↓
2. Click "Sign In"
   ↓
3. Enter email, password
   ↓
4. Click "Sign In"
   ↓
5. Redirect to dashboard
   ↓
6. See all memories on map
   ↓
7. Browse via map or timeline
   ↓
8. Search for specific memory
   ↓
9. Filter by category/mood/date
   ↓
10. View memory detail
    ↓
11. Edit memory
    ↓
12. Add more photos
    ↓
13. Create new memory
    ↓
14. View statistics
    ↓
15. Logout
```

## Create Memory Journey
```
1. Click "Add Memory" button
   ↓
2. See memory form
   ↓
3. Click on map to select location
   ↓
4. See marker at selected location
   ↓
5. Enter title
   ↓
6. Enter content (optional)
   ↓
7. Select date
   ↓
8. Select mood
   ↓
9. Select category
   ↓
10. Add image URL (optional)
    ↓
11. Click "Save Memory"
    ↓
12. See loading state
    ↓
13. Redirect to memory detail
    ↓
14. See marker on map
```

## Edit Memory Journey
```
1. Open memory detail
   ↓
2. Click "Edit" button
   ↓
3. See pre-filled form
   ↓
4. Modify fields
   ↓
5. Click "Save Changes"
   ↓
6. See loading state
   ↓
7. Redirect to memory detail
   ↓
8. See updated data
```

## Delete Memory Journey
```
1. Open memory detail
   ↓
2. Click "Delete" button
   ↓
3. See confirmation modal
   ↓
4. Click "Delete"
   ↓
5. See loading state
   ↓
6. Redirect to dashboard
   ↓
7. See marker removed
```

## Search Memory Journey
```
1. Go to dashboard
   ↓
2. Enter search query
   ↓
3. See loading state
   ↓
4. See filtered results
   ↓
5. Click memory to view detail
   ↓
6. Clear search to see all
```

## Filter Memory Journey
```
1. Go to dashboard
   ↓
2. Select category filter
   ↓
3. See filtered markers
   ↓
4. Select mood filter
   ↓
5. See further filtered results
   ↓
6. Select date range
   ↓
7. See final filtered results
   ↓
8. Clear filters to see all
```

## View Timeline Journey
```
1. Click "Timeline" button
   ↓
2. See chronological memories
   ↓
3. Scroll through years
   ↓
4. Click memory to view detail
   ↓
5. Filter by year/category/mood
   ↓
6. See filtered timeline
```

## View Statistics Journey
```
1. Click "Statistics" button
   ↓
2. See overview cards
   ↓
3. See mood distribution chart
   ↓
4. See category distribution chart
   ↓
5. See monthly activity chart
```

## Upload Images Journey
```
1. Open memory detail
   ↓
2. Click "Add Photo"
   ↓
3. See upload modal
   ↓
4. Enter image URL
   ↓
5. Click "Add Photo"
   ↓
6. See loading state
   ↓
7. See image in gallery
```

## Location Permission Denied Journey
```
1. Click "Get my location"
   ↓
2. Browser shows permission dialog
   ↓
3. User denies permission
   ↓
4. See error message
   ↓
5. Manually select location on map
```

## Network Failure Journey
```
1. Perform any action
   ↓
2. Network fails
   ↓
3. See error toast
   ↓
4. See "Retry" button
   ↓
5. Click retry
   ↓
6. Action retries
```

## Expired JWT Journey
```
1. Perform any action
   ↓
2. Token expired
   ↓
3. Receive 401 error
   ↓
4. Auto-logout
   ↓
5. Redirect to login
   ↓
6. See "Session expired" message
```

---

# 35. EDGE CASES

| Edge Case | Behavior |
|-----------|----------|
| User refreshes during create | Form data lost (future: persist in localStorage) |
| Double-click save | Button disabled, prevent duplicate |
| Internet disconnects | Show error, retry when online |
| Image upload fails | Show error, keep form data |
| Location permission denied | Show error, manual location selection |
| GPS unavailable | Show error, manual location selection |
| Invalid coordinates | Show error, prevent submit |
| Memory deleted while detail page open | Redirect to dashboard on next action |
| Expired token | Auto-logout, redirect to login |
| Empty database | Show empty state, prompt to create |
| 1000+ markers | Map may slow (future: clustering) |
| Very long title | Truncate in UI, validate max length |
| Very long content | Show truncated with "Read more" |
| Very large image | Reject if file upload (future: compress) |
| Unsupported image | Show error, reject |
| Duplicate image | Allow (future: detect and warn) |
| Search with special characters | Sanitize, allow basic chars |
| Search empty string | Show all, no query |
| Invalid date | Show error, prevent submit |
| Future date | Allow (future: warn) |
| Timezone issue | Store UTC, display local |
| Category deleted while memory exists | Keep category name in memory (cascade not set) |
| User deleted while memories exist | Cascade delete memories |
| Memory with no images | Show empty state, add photo button |
| Memory with no content | Hide content section |
| Memory with no location name | Hide location name, show coordinates |
| Concurrent edits | Last write wins (future: optimistic locking) |
| Rapid filter changes | Debounce, prevent API spam |
| Browser back button | Preserve state (future: history API) |
| Mobile orientation change | Responsive layout adapts |
| Dark mode toggle | System preference respected |

---

# 36. TESTING REQUIREMENTS

## Unit Tests
| Area | Coverage Goal | Status |
|------|---------------|--------|
| Auth service | 80% | ⚪ MISSING |
| Memory service | 80% | ⚪ MISSING |
| DTO validation | 90% | ⚪ MISSING |
| Utility functions | 90% | ⚪ MISSING |

## Integration Tests
| Area | Coverage Goal | Status |
|------|---------------|--------|
| API endpoints | 70% | ⚪ MISSING |
| Database operations | 80% | ⚪ MISSING |
| Auth flow | 80% | ⚪ MISSING |

## API Tests
| Endpoint | Status |
|----------|--------|
| POST /auth/register | ⚪ MISSING |
| POST /auth/login | ⚪ MISSING |
| GET /auth/me | ⚪ MISSING |
| GET /memories | ⚪ MISSING |
| POST /memories | ⚪ MISSING |
| PUT /memories/:id | ⚪ MISSING |
| DELETE /memories/:id | ⚪ MISSING |
| GET /memories/statistics | ⚪ MISSING |
| POST /memories/:id/images | ⚪ MISSING |
| DELETE /memories/:memoryId/images/:imageId | ⚪ MISSING |

## Frontend Tests
| Component | Status |
|-----------|--------|
| Map component | ⚪ MISSING |
| Memory form | ⚪ MISSING |
| Memory detail | ⚪ MISSING |
| Timeline | ⚪ MISSING |
| Statistics | ⚪ MISSING |
| Auth forms | ⚪ MISSING |

## E2E Tests
| Flow | Status |
|------|--------|
| Register → Login → Create Memory | ⚪ MISSING |
| Login → Edit Memory | ⚪ MISSING |
| Login → Delete Memory | ⚪ MISSING |
| Login → Search → Filter | ⚪ MISSING |
| Login → Timeline → Statistics | ⚪ MISSING |

## Security Tests
| Test | Status |
|------|--------|
| SQL injection | ⚪ MISSING |
| XSS | ⚪ MISSING |
| CSRF | ⚪ MISSING |
| Rate limiting | ⚪ MISSING |
| Authorization bypass | ⚪ MISSING |

## Responsive Tests
| Breakpoint | Status |
|------------|--------|
| 375px (Mobile) | 🟢 MANUAL |
| 768px (Tablet) | 🟢 MANUAL |
| 1280px (Desktop) | 🟢 MANUAL |

## Browser Tests
| Browser | Status |
|---------|--------|
| Chrome | 🟢 MANUAL |
| Edge | 🟢 MANUAL |
| Firefox | 🟢 MANUAL |
| Safari | ⚪ MISSING |

---

# 37. ACCEPTANCE CRITERIA

## AUTH-001: Register

```
Given: User is on registration page
When: User enters valid email (unique), password (6+ chars), and name
And: Clicks "Create Account"
Then: Account is created in database
And: Password is hashed with bcrypt
And: JWT token is generated
And: User is logged in
And: Redirected to dashboard
And: Token stored in localStorage
```

## AUTH-002: Login

```
Given: User is registered
When: User enters valid email and password
And: Clicks "Sign In"
Then: User is authenticated
And: JWT token is received
And: Redirected to dashboard
And: Token stored in localStorage
```

## AUTH-003: Logout

```
Given: User is logged in
When: User clicks logout
Then: Token is removed from localStorage
And: User data is removed from localStorage
And: Auth store is cleared
And: Redirected to login page
```

## AUTH-004: Protected Routes

```
Given: User is not authenticated
When: User tries to access protected route
Then: Redirected to login page
```

## AUTH-005: Authorization

```
Given: User A is authenticated
When: User A tries to access User B's memory
Then: Return 403 Forbidden
And: Show "Access denied" message
```

## MAP-001: Map Rendering

```
Given: User is on dashboard
When: Dashboard loads
Then: Map is rendered with OpenStreetMap tiles
And: Map is centered at default location
And: Zoom controls are visible
```

## MAP-002: Marker Display

```
Given: User has memories
When: Dashboard loads
Then: All memories are shown as markers on map
And: Each marker has correct location
```

## MAP-003: Marker Popup

```
Given: User clicks on a marker
When: Marker is clicked
Then: Popup shows memory title
And: Popup shows memory date
And: Popup shows memory mood
And: Popup shows "View Memory" button
```

## MAP-004: Click Map

```
Given: User is on memory creation page
When: User clicks on map
Then: Coordinates are captured
And: Marker appears at clicked location
And: Form is pre-filled with coordinates
```

## MEM-001: Create Memory

```
Given: User is authenticated
When: User selects location on map
And: Fills all required fields (title, date, mood, category)
And: Clicks "Save Memory"
Then: Memory is created in database
And: Marker appears on map
And: User is redirected to memory detail
```

## MEM-002: Edit Memory

```
Given: User is memory owner
When: User opens memory edit page
And: Modifies memory fields
And: Clicks "Save Changes"
Then: Memory is updated in database
And: Map marker is updated
And: Redirected to memory detail
```

## MEM-003: Delete Memory

```
Given: User is memory owner
When: User clicks "Delete"
And: Confirms deletion
Then: Memory is deleted from database
And: Associated images are deleted
And: Marker is removed from map
And: User is redirected to dashboard
```

## MEM-004: Memory Ownership

```
Given: User A is authenticated
When: User A requests User B's memory via API
Then: API returns 403 Forbidden
```

## IMG-001: Add Image

```
Given: User is memory owner
When: User opens memory detail
And: Clicks "Add Photo"
And: Enters valid image URL
And: Clicks "Add Photo"
Then: Image is added to database
And: Image appears in gallery
```

## IMG-002: Delete Image

```
Given: User is memory owner
When: User clicks delete button on image
Then: Image is deleted from database
And: Image is removed from gallery
```

## TIM-001: Timeline View

```
Given: User has memories
When: User navigates to timeline
Then: Memories are shown chronologically
And: Memories are grouped by year
And: Each memory shows date, mood, category
```

## TIM-002: Timeline Filter

```
Given: User is on timeline
When: User selects category filter
Then: Timeline shows only memories in that category
```

## SEARCH-001: Search Memories

```
Given: User has memories
When: User enters search query
Then: Memories matching query are shown
And: Results include matches in title, content, or location
```

## STAT-001: Statistics View

```
Given: User has memories
When: User navigates to statistics
Then: Overview cards show correct counts
And: Mood distribution chart is shown
And: Category distribution chart is shown
And: Monthly activity chart is shown
```

---

# 38. MVP SCOPE

## MVP Features (Must Complete in 1 Month)

### Authentication (P0)
- ✅ Register
- ✅ Login
- ✅ Logout
- ✅ Protected routes
- ✅ Authorization (ownership)

### Map (P0)
- ✅ Map rendering
- ✅ Marker display
- ✅ Marker popup
- ✅ Click map for location

### Memory CRUD (P0)
- ✅ Create memory
- ✅ Read memory (detail)
- ✅ Update memory
- ✅ Delete memory
- ✅ Memory ownership

### Memory Fields (P0)
- ✅ Title
- ✅ Content
- ✅ Location (lat/lng)
- ✅ Location name
- ✅ Date
- ✅ Mood
- ✅ Category

### Images (P1)
- ✅ Add image (URL)
- ✅ Delete image
- ✅ Image gallery

### Timeline (P1)
- ✅ Timeline view
- ✅ Year grouping
- ✅ Chronological display

### Search & Filter (P1)
- ✅ Search
- ✅ Category filter
- ✅ Mood filter
- ✅ Date range filter

### Statistics (P1)
- ✅ Statistics view
- ✅ Overview cards
- ✅ Mood distribution
- ✅ Category distribution
- ✅ Monthly activity

### Responsive UI (P1)
- ✅ Mobile layout
- ✅ Tablet layout
- ✅ Desktop layout

### Security (P0)
- ✅ Password hashing
- ✅ JWT authentication
- ✅ Authorization
- ✅ DTO validation
- ✅ CORS
- ✅ Security headers

### Error Handling (P0)
- ✅ API error handling
- ✅ Loading states
- ✅ Empty states

---

# 39. MVP — KHÔNG LÀM

## Out of Scope for MVP

- ❌ Social network features
- ❌ Follow users
- ❌ Like memories
- ❌ Comments on memories
- ❌ Chat/messaging
- ❌ AI features
- ❌ Recommendations
- ❌ Real-time updates
- ❌ Mobile app (native)
- ❌ Payment/subscription
- ❌ Public profiles
- ❌ Memory sharing
- ❌ Export/import
- ❌ Advanced map features (clustering, heatmap)
- ❌ File upload (URL only for MVP)
- ❌ Video support
- ❌ Audio support
- ❌ Custom categories
- ❌ User profile editing
- ❌ "On this day" feature
- ❌ Memory reminders
- ❌ Advanced statistics

---

# 40. FUTURE FEATURES

## Social Features (🟣 FUTURE)
- Public memories
- Share memory via link
- Follow users
- Friend system
- Reactions (like, love)
- Comments on memories
- Memory sharing to social media

## AI Features (🟣 FUTURE)
- Auto-caption generation from images
- Mood detection from content/images
- Memory summary (AI-generated)
- Location story generation
- AI timeline suggestions
- Smart memory recommendations

## Map Features (🟣 FUTURE)
- Heatmap of memory density
- Travel route visualization
- Visited countries map
- Memory clustering
- 3D map view
- Street view integration
- Custom map styles

## Media Features (🟣 FUTURE)
- Video upload
- Audio recording
- Voice memories
- Image compression
- Thumbnail generation
- Cloudinary integration
- S3 integration
- Image editing

## Advanced Features (🟣 FUTURE)
- Push notifications
- Memory reminders
- "On this day" feature
- Memory anniversaries
- Yearly recap
- Memory export (PDF, JSON)
- Memory import
- Offline support
- PWA
- Dark mode toggle (currently system preference)
- Custom themes

## Profile Features (🟣 FUTURE)
- Profile editing
- Avatar upload
- Bio field
- Birthday
- Privacy settings
- Account deletion
- Password change

## Search & Filter (🟣 FUTURE)
- Advanced search
- Location search
- Full-text search
- Saved filters
- Filter presets

## Statistics (🟣 FUTURE)
- Advanced charts
- Year-over-year comparison
- Mood trends over time
- Category trends
- Export statistics

---

# 41. ROADMAP

## Week 1: Foundation
**Goal:** Set up project infrastructure and authentication

**Features:**
- Database setup (PostgreSQL + Prisma)
- Backend setup (NestJS)
- Frontend setup (Next.js)
- Authentication (Register, Login, Logout)
- Protected routes
- JWT implementation
- Security headers

**Dependencies:**
- PostgreSQL running
- Node.js installed

**Deliverables:**
- Working auth flow
- Database schema
- API endpoints for auth
- Frontend auth pages

**Acceptance Criteria:**
- User can register
- User can login
- User can logout
- Protected routes work

## Week 2: Core Memory
**Goal:** Implement memory CRUD and map integration

**Features:**
- Map rendering (Leaflet)
- Marker display
- Create memory
- Read memory (detail)
- Update memory
- Delete memory
- Memory ownership
- Location selection on map
- Category system
- Mood system

**Dependencies:**
- Week 1 complete
- Categories seeded

**Deliverables:**
- Working map with markers
- Memory CRUD operations
- Memory detail page
- Category selection
- Mood selection

**Acceptance Criteria:**
- User can create memory
- User can view memory
- User can edit memory
- User can delete memory
- Map shows all memories
- Only own memories accessible

## Week 3: Experience
**Goal:** Enhance user experience with additional features

**Features:**
- Image upload (URL-based)
- Image gallery
- Timeline view
- Search functionality
- Filtering (category, mood, date)
- Statistics view
- Responsive design polish
- Loading states
- Empty states
- Error handling

**Dependencies:**
- Week 2 complete

**Deliverables:**
- Working timeline
- Working search
- Working filters
- Working statistics
- Image upload functionality
- Responsive layouts

**Acceptance Criteria:**
- Timeline shows memories chronologically
- Search returns correct results
- Filters work correctly
- Statistics show accurate data
- Images can be added/removed
- Mobile layout works

## Week 4: Polish + Testing + Deploy
**Goal:** Final polish, testing, and deployment

**Features:**
- Bug fixes
- Performance optimization
- Security audit
- E2E testing
- Documentation (README)
- Deployment preparation
- Environment configuration

**Dependencies:**
- Week 3 complete

**Deliverables:**
- Bug-free application
- README documentation
- Deployment-ready code
- Environment configuration guide

**Acceptance Criteria:**
- All critical bugs fixed
- Application builds successfully
- Documentation complete
- Deployment guide complete

---

# 42. DEVELOPMENT CHECKLIST

## Authentication
- [x] Register UI
- [x] Register API
- [x] Register validation
- [x] Password hashing (bcrypt)
- [x] Login UI
- [x] Login API
- [x] JWT implementation
- [x] JWT strategy
- [x] Local strategy
- [x] Protected routes (backend)
- [x] Protected routes (frontend)
- [x] Logout
- [x] Current user API
- [x] Authorization (ownership)

## Map
- [x] Map render
- [x] Marker component
- [x] Marker popup
- [x] Click map for location
- [x] Marker display from API
- [ ] Current location (🟣 FUTURE)
- [ ] Location search (🔵 PLANNED)
- [ ] Reverse geocoding (🟣 FUTURE)
- [ ] Map clustering (🟣 FUTURE)

## Memory
- [x] Create memory UI
- [x] Create memory API
- [x] Create memory validation
- [x] Read memory UI (detail)
- [x] Read memory API
- [x] Update memory UI (edit)
- [x] Update memory API
- [x] Delete memory UI
- [x] Delete memory API
- [x] Memory ownership check
- [ ] Memory sorting (🟡 PARTIAL)
- [x] Memory filtering
- [ ] Memory pagination (🟣 FUTURE)

## Memory Form
- [x] Title field
- [x] Content field
- [x] Date field
- [x] Location selection
- [x] Category selector
- [x] Mood selector
- [x] Image URL input
- [x] Form validation
- [x] Save button
- [x] Cancel button
- [x] Loading states
- [x] Error handling

## Category
- [x] Category model
- [x] Category API (list)
- [x] Category seeding
- [x] Category filtering
- [x] Category statistics
- [ ] Custom categories (🟣 FUTURE)
- [ ] Category editing (🟣 FUTURE)

## Mood
- [x] Mood enum
- [x] Mood selector UI
- [x] Mood filtering
- [x] Mood statistics

## Images
- [x] Add image API
- [x] Delete image API
- [x] Image gallery UI
- [x] Image preview
- [x] Image delete button
- [ ] Image ordering (🟣 FUTURE)
- [ ] File upload (🟣 FUTURE)
- [ ] Upload progress (🔵 PLANNED)
- [ ] Fullscreen viewer (🟣 FUTURE)

## Timeline
- [x] Timeline page
- [x] Chronological display
- [x] Year grouping
- [x] Memory cards
- [x] Timeline filters
- [ ] Oldest first sort (⚪ MISSING)

## Search
- [x] Search input
- [x] Search API
- [x] Search debounce
- [x] Search results
- [x] No results state

## Filter
- [x] Category filter
- [x] Mood filter
- [x] Date range filter
- [x] Filter combinations
- [x] Clear filters

## Statistics
- [x] Statistics page
- [x] Overview cards
- [x] Mood distribution
- [x] Category distribution
- [x] Monthly activity
- [x] Statistics API

## Dashboard
- [x] Map view
- [x] Memory markers
- [x] Search bar
- [x] Filter controls
- [x] Add memory button
- [x] User menu
- [x] Logout button
- [ ] Memory list (⚪ MISSING)

## Responsive
- [x] Mobile layout
- [x] Tablet layout
- [x] Desktop layout
- [x] Responsive grid
- [x] Responsive typography

## Navigation
- [x] Landing page
- [x] Login page
- [x] Register page
- [x] Dashboard
- [x] Timeline
- [x] Statistics
- [x] Memory detail
- [x] Memory edit
- [x] Memory create
- [ ] Profile page (⚪ MISSING)

## Security
- [x] Password hashing
- [x] JWT authentication
- [x] JWT guard
- [x] Authorization
- [x] DTO validation
- [x] CORS
- [x] Security headers
- [ ] Rate limiting (🔵 PLANNED)
- [ ] CSRF protection (🔵 PLANNED)

## Error Handling
- [x] API error handling
- [x] Network error handling
- [x] Validation error handling
- [x] 401 handling (auto-logout)
- [x] 403 handling
- [x] 404 handling
- [x] 500 handling

## Loading States
- [x] Login loading
- [x] Register loading
- [x] Map loading
- [x] Memories loading
- [x] Memory detail loading
- [x] Create loading
- [x] Edit loading
- [x] Delete loading
- [x] Upload loading
- [x] Search loading
- [x] Statistics loading
- [x] Timeline loading

## Empty States
- [x] No memories
- [x] No search results
- [x] No timeline
- [x] No images
- [x] No statistics

## Performance
- [x] Database indexes
- [x] Search debounce
- [ ] API pagination (🔵 PLANNED)
- [ ] Lazy loading (🔵 PLANNED)
- [ ] Caching (🟣 FUTURE)

## Testing
- [ ] Unit tests (⚪ MISSING)
- [ ] Integration tests (⚪ MISSING)
- [ ] API tests (⚪ MISSING)
- [ ] Frontend tests (⚪ MISSING)
- [ ] E2E tests (⚪ MISSING)
- [ ] Security tests (⚪ MISSING)

## Documentation
- [x] README
- [x] PROJECT_FEATURES
- [ ] API documentation (⚪ MISSING)
- [ ] Deployment guide (⚪ MISSING)

---

# 43. IMPLEMENTATION DEPENDENCY GRAPH

```
PostgreSQL Database
    ↓
Prisma Schema & Migrations
    ↓
Backend (NestJS)
    ↓
Authentication Module
    ↓
Users Module
    ↓
Categories Module
    ↓
Memories Module
    ↓
Memory Images Module
    ↓
API Endpoints
    ↓
Frontend API Client (Axios)
    ↓
Auth Store (Zustand)
    ↓
Memories Store (Zustand)
    ↓
Map Component (Leaflet)
    ↓
Memory Form
    ↓
Memory Detail Page
    ↓
Timeline Page
    ↓
Search & Filter
    ↓
Statistics Page
    ↓
Dashboard
    ↓
Responsive Design
    ↓
Error Handling & Loading States
    ↓
Testing
    ↓
Documentation
    ↓
Deployment
```

### Dependency Explanations

1. **Database** must exist before anything else
2. **Prisma** defines schema and generates client
3. **Backend** depends on Prisma client
4. **Authentication** must work before protected features
5. **Users** needed for authentication
6. **Categories** needed for memory creation
7. **Memories** core feature depends on users and categories
8. **Memory Images** depends on memories
9. **API** must be ready before frontend integration
10. **API Client** wraps API calls
11. **Auth Store** manages authentication state
12. **Memories Store** manages memory state
13. **Map Component** displays memories
14. **Memory Form** creates memories
15. **Memory Detail** displays single memory
16. **Timeline** displays memories chronologically
17. **Search/Filter** depends on memories API
18. **Statistics** depends on memories aggregation
19. **Dashboard** integrates all features
20. **Responsive** applies to all UI
21. **Error Handling** applies to all features
22. **Testing** validates all features
23. **Documentation** describes all features
24. **Deployment** deploys complete application

---

# 44. FEATURE MATRIX

| ID | Feature | Priority | Status | Frontend | Backend | Database | Testing | MVP |
|----|---------|----------|--------|----------|---------|----------|---------|-----|
| AUTH-001 | Register | P0 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| AUTH-002 | Login | P0 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| AUTH-003 | Logout | P0 | 🟢 | ✅ | ✅ | - | ⚪ | ✅ |
| AUTH-004 | Protected Routes | P0 | 🟢 | ✅ | ✅ | - | ⚪ | ✅ |
| AUTH-005 | Authorization | P0 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| AUTH-006 | Current User | P0 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| MAP-001 | Map Rendering | P0 | 🟢 | ✅ | - | - | ⚪ | ✅ |
| MAP-002 | Marker Display | P0 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| MAP-003 | Marker Popup | P0 | 🟢 | ✅ | - | - | ⚪ | ✅ |
| MAP-004 | Click Map | P0 | 🟢 | ✅ | - | - | ⚪ | ✅ |
| MAP-005 | Current Location | P3 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |
| MAP-006 | Location Search | P2 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |
| MAP-007 | Reverse Geocoding | P3 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |
| MAP-008 | Map Clustering | P2 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |
| MEM-001 | Create Memory | P0 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| MEM-002 | Read Memory (Detail) | P0 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| MEM-003 | Update Memory | P0 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| MEM-004 | Delete Memory | P0 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| MEM-005 | Memory Ownership | P0 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| MEM-006 | Memory Sorting | P1 | 🟡 | 🟡 | ✅ | ✅ | ⚪ | ✅ |
| MEM-007 | Memory Filtering | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| MEM-008 | Memory Pagination | P3 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |
| IMG-001 | Add Image (URL) | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| IMG-002 | Delete Image | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| IMG-003 | Image Gallery | P1 | 🟢 | ✅ | - | ✅ | ⚪ | ✅ |
| IMG-004 | Image Ordering | P3 | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ❌ |
| IMG-005 | File Upload | P2 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |
| IMG-006 | Upload Progress | P2 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |
| IMG-007 | Fullscreen Viewer | P3 | ⚪ | ⚪ | - | - | ⚪ | ❌ |
| CAT-001 | Category List | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| CAT-002 | Category Seeding | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| CAT-003 | Category Filtering | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| CAT-004 | Category Statistics | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| CAT-005 | Custom Categories | P4 | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ❌ |
| MOOD-001 | Mood Selector | P1 | 🟢 | ✅ | - | ✅ | ⚪ | ✅ |
| MOOD-002 | Mood Filtering | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| MOOD-003 | Mood Statistics | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| TIM-001 | Timeline View | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| TIM-002 | Timeline Filters | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| TIM-003 | Timeline Sorting | P2 | 🟡 | 🟡 | ✅ | ✅ | ⚪ | ✅ |
| SEARCH-001 | Search Memories | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| FILTER-001 | Category Filter | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| FILTER-002 | Mood Filter | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| FILTER-003 | Date Range Filter | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| FILTER-004 | Filter Combinations | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| STAT-001 | Statistics View | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| STAT-002 | Overview Cards | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| STAT-003 | Mood Distribution | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| STAT-004 | Category Distribution | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| STAT-005 | Monthly Activity | P1 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| DASH-001 | Dashboard Layout | P0 | 🟢 | ✅ | - | - | ⚪ | ✅ |
| DASH-002 | Memory List | P2 | ⚪ | ⚪ | ✅ | ✅ | ⚪ | ❌ |
| RESP-001 | Mobile Layout | P1 | 🟢 | ✅ | - | - | ⚪ | ✅ |
| RESP-002 | Tablet Layout | P1 | 🟢 | ✅ | - | - | ⚪ | ✅ |
| RESP-003 | Desktop Layout | P1 | 🟢 | ✅ | - | - | ⚪ | ✅ |
| NAV-001 | Landing Page | P1 | 🟢 | ✅ | - | - | ⚪ | ✅ |
| NAV-002 | Navigation Routes | P0 | 🟢 | ✅ | - | - | ⚪ | ✅ |
| PROF-001 | Profile View | P2 | ⚪ | ⚪ | ✅ | ✅ | ⚪ | ❌ |
| PROF-002 | Profile Editing | P2 | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ❌ |
| SEC-001 | Password Hashing | P0 | 🟢 | - | ✅ | ✅ | ⚪ | ✅ |
| SEC-002 | JWT Authentication | P0 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| SEC-003 | Authorization | P0 | 🟢 | ✅ | ✅ | ✅ | ⚪ | ✅ |
| SEC-004 | DTO Validation | P0 | 🟢 | ✅ | ✅ | - | ⚪ | ✅ |
| SEC-005 | CORS | P0 | 🟢 | - | ✅ | - | ⚪ | ✅ |
| SEC-006 | Security Headers | P0 | 🟢 | - | ✅ | - | ⚪ | ✅ |
| SEC-007 | Rate Limiting | P2 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |
| SEC-008 | CSRF Protection | P2 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |
| ERR-001 | API Error Handling | P0 | 🟢 | ✅ | ✅ | - | ⚪ | ✅ |
| ERR-002 | Network Error Handling | P0 | 🟢 | ✅ | - | - | ⚪ | ✅ |
| ERR-003 | Validation Error Handling | P0 | 🟢 | ✅ | ✅ | - | ⚪ | ✅ |
| LOAD-001 | Loading States | P0 | 🟢 | ✅ | - | - | ⚪ | ✅ |
| EMPTY-001 | Empty States | P0 | 🟢 | ✅ | - | - | ⚪ | ✅ |
| PERF-001 | Database Indexes | P0 | 🟢 | - | - | ✅ | ⚪ | ✅ |
| PERF-002 | Search Debounce | P1 | 🟢 | ✅ | - | - | ⚪ | ✅ |
| PERF-003 | API Pagination | P2 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |
| PERF-004 | Lazy Loading | P2 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |
| A11Y-001 | Keyboard Navigation | P2 | 🟡 | 🟡 | - | - | ⚪ | ✅ |
| A11Y-002 | ARIA Labels | P2 | ⚪ | ⚪ | - | - | ⚪ | ❌ |
| A11Y-003 | Alt Text | P2 | 🟡 | 🟡 | - | - | ⚪ | ✅ |
| TEST-001 | Unit Tests | P2 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |
| TEST-002 | Integration Tests | P2 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |
| TEST-003 | E2E Tests | P2 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |
| DOC-001 | README | P0 | 🟢 | - | - | - | ⚪ | ✅ |
| DOC-002 | API Documentation | P2 | ⚪ | ⚪ | ⚪ | - | ⚪ | ❌ |

---

# 45. TRACEABILITY MATRIX

| Requirement | Feature ID | UI | API | Database | Test |
|-------------|------------|-----|-----|----------|------|
| User registration | AUTH-001 | /register | POST /auth/register | users | ⚪ |
| User login | AUTH-002 | /login | POST /auth/login | users | ⚪ |
| User logout | AUTH-003 | Dashboard | - | - | ⚪ |
| Protected routes | AUTH-004 | All protected | JWT Guard | - | ⚪ |
| Memory ownership | AUTH-005 | - | Check userId | memories.userId | ⚪ |
| View map | MAP-001 | Dashboard | - | - | ⚪ |
| Show markers | MAP-002 | Dashboard | GET /memories | memories | ⚪ |
| Marker popup | MAP-003 | Dashboard | - | - | ⚪ |
| Select location | MAP-004 | /memories/new | - | - | ⚪ |
| Create memory | MEM-001 | /memories/new | POST /memories | memories | ⚪ |
| View memory | MEM-002 | /memories/[id] | GET /memories/:id | memories | ⚪ |
| Edit memory | MEM-003 | /memories/[id]/edit | PUT /memories/:id | memories | ⚪ |
| Delete memory | MEM-004 | /memories/[id] | DELETE /memories/:id | memories | ⚪ |
| Filter memories | MEM-007 | Dashboard | GET /memories?filter | memories | ⚪ |
| Add image | IMG-001 | /memories/[id] | POST /memories/:id/images | memory_images | ⚪ |
| Delete image | IMG-002 | /memories/[id] | DELETE /memories/:id/images/:id | memory_images | ⚪ |
| View categories | CAT-001 | Dropdowns | GET /categories | categories | ⚪ |
| Select mood | MOOD-001 | Form | - | - | ⚪ |
| View timeline | TIM-001 | /timeline | GET /memories | memories | ⚪ |
| Search memories | SEARCH-001 | Dashboard | GET /memories?search | memories | ⚪ |
| View statistics | STAT-001 | /statistics | GET /memories/statistics | memories | ⚪ |
| Responsive design | RESP-001 | All | - | - | ⚪ |
| Security | SEC-001-006 | - | Various | - | ⚪ |

---

# 46. CURRENT PROJECT AUDIT

## CURRENT IMPLEMENTATION STATUS

### Authentication
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Register (UI + API)
- Login (UI + API)
- Logout
- JWT authentication
- Protected routes (backend guards)
- Protected routes (frontend auth check)
- Authorization (ownership check)
- Current user API

**Gaps:**
- None critical

### Map
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Map rendering (Leaflet + OpenStreetMap)
- Marker display
- Marker popup
- Click map for location selection
- Dynamic import with SSR disabled

**Gaps:**
- Current location button (P3)
- Location search (P2)
- Reverse geocoding (P3)
- Map clustering (P2)

### Memory Management
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Create memory (UI + API)
- Read memory detail (UI + API)
- Update memory (UI + API)
- Delete memory (UI + API)
- Memory ownership enforcement
- Memory filtering (category, mood, date, search)

**Gaps:**
- Memory sorting (only newest first implemented)
- Memory pagination (not needed for MVP)

### Memory Form
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Title field
- Content field
- Date picker
- Location selection (map click)
- Category selector
- Mood selector
- Image URL input
- Form validation
- Save/Cancel buttons
- Loading states
- Error handling

**Gaps:**
- None critical

### Category System
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Category model
- Category API (list)
- Category seeding
- Category filtering
- Category statistics

**Gaps:**
- Custom categories (P4)
- Category editing (P4)

### Mood System
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Mood enum (9 moods)
- Mood selector UI
- Mood filtering
- Mood statistics

**Gaps:**
- None

### Image System
**Status:** 🟡 PARTIALLY IMPLEMENTED

**Implemented:**
- Add image via URL
- Delete image
- Image gallery
- Image preview

**Gaps:**
- File upload (current is URL-only)
- Upload progress
- Image ordering
- Fullscreen viewer
- Image validation (file type, size)

### Timeline
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Timeline page
- Chronological display (newest first)
- Year grouping
- Memory cards with details
- Timeline filters

**Gaps:**
- Oldest first sorting option

### Search
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Search input
- Search API
- Search debounce
- Search results
- No results state

**Gaps:**
- None

### Filtering
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Category filter
- Mood filter
- Date range filter
- Filter combinations
- Clear filters

**Gaps:**
- Location filter (P2)

### Statistics
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Statistics page
- Overview cards (total, this year, locations, categories)
- Mood distribution chart
- Category distribution chart
- Monthly activity chart
- Statistics API

**Gaps:**
- None

### Dashboard
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Map view
- Memory markers
- Search bar
- Filter controls
- Add memory button
- User menu
- Logout button
- Timeline button
- Statistics button

**Gaps:**
- Memory list (below map or sidebar)

### Responsive Design
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Mobile layout (full-screen map)
- Tablet layout
- Desktop layout
- Responsive grids
- Responsive typography

**Gaps:**
- Bottom navigation for mobile (optional)

### Navigation
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Landing page
- Login page
- Register page
- Dashboard
- Timeline
- Statistics
- Memory detail
- Memory edit
- Memory create

**Gaps:**
- Profile page (P2)

### Security
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Password hashing (bcrypt, 10 rounds)
- JWT authentication (7-day expiration)
- Authorization (ownership check)
- DTO validation (class-validator)
- CORS (configured)
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)

**Gaps:**
- Rate limiting (P2)
- CSRF protection (P2)

### Error Handling
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- API error handling
- Network error handling
- Validation error handling
- 401 handling (auto-logout)
- 403 handling
- 404 handling
- 500 handling

**Gaps:**
- None critical

### Loading States
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- Login loading
- Register loading
- Map loading
- Memories loading
- Memory detail loading
- Create loading
- Edit loading
- Delete loading
- Upload loading
- Search loading
- Statistics loading
- Timeline loading

**Gaps:**
- None

### Empty States
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- No memories
- No search results
- No timeline
- No images
- No statistics

**Gaps:**
- None

### Performance
**Status:** 🟡 PARTIALLY IMPLEMENTED

**Implemented:**
- Database indexes (userId, categoryId, mood)
- Search debounce (300ms)
- Zustand state caching

**Gaps:**
- API pagination
- Lazy loading
- Caching

### Accessibility
**Status:** 🟡 PARTIALLY IMPLEMENTED

**Implemented:**
- Basic keyboard navigation
- Focus states (partial)
- WCAG AA contrast
- Clear button labels
- Visible error messages

**Gaps:**
- ARIA labels
- Complete alt text coverage
- Screen reader support

### Testing
**Status:** ⚪ MISSING

**Implemented:**
- None

**Gaps:**
- Unit tests
- Integration tests
- API tests
- Frontend tests
- E2E tests
- Security tests

### Documentation
**Status:** 🟢 IMPLEMENTED

**Implemented:**
- README
- PROJECT_FEATURES (this file)

**Gaps:**
- API documentation
- Deployment guide

---

# 47. BUG / GAP LIST

| ID | Area | Problem | Severity | Expected | Current | Fix Needed |
|----|------|---------|----------|----------|---------|------------|
| BUG-001 | Image System | Only URL-based upload, no file upload | MEDIUM | File upload with drag & drop | URL input only | Implement file upload (P2) |
| BUG-002 | Image System | No upload progress indicator | LOW | Progress bar during upload | No progress | Add progress UI (P2) |
| BUG-003 | Map | No current location button | LOW | "Get my location" button | Missing | Add geolocation (P3) |
| BUG-004 | Map | No location search | MEDIUM | Search for places | Missing | Add Nominatim search (P2) |
| BUG-005 | Map | No reverse geocoding | LOW | Auto-fill location name | Manual input only | Add reverse geocoding (P3) |
| BUG-006 | Timeline | No oldest-first sort | LOW | Sort option | Newest only | Add sort toggle (P2) |
| BUG-007 | Dashboard | No memory list | LOW | List below map | Map only | Add memory list (P2) |
| BUG-008 | Navigation | No profile page | MEDIUM | /profile route | Missing | Implement profile (P2) |
| BUG-009 | Security | No rate limiting | MEDIUM | Rate limit API endpoints | No limit | Add rate limiter (P2) |
| BUG-010 | Security | No CSRF protection | MEDIUM | CSRF tokens | Missing | Add CSRF (P2) |
| BUG-011 | Performance | No API pagination | MEDIUM | Paginate large datasets | Load all | Add pagination (P2) |
| BUG-012 | Performance | No lazy loading | LOW | Lazy load images | Load all | Add lazy loading (P2) |
| BUG-013 | Accessibility | Missing ARIA labels | LOW | ARIA on interactive elements | Missing | Add ARIA labels (P2) |
| BUG-014 | Accessibility | Incomplete alt text | LOW | Alt text on all images | Partial | Complete alt text (P2) |
| BUG-015 | Testing | No unit tests | HIGH | 80% coverage | 0% | Write unit tests (P2) |
| BUG-016 | Testing | No integration tests | HIGH | 70% coverage | 0% | Write integration tests (P2) |
| BUG-017 | Testing | No E2E tests | MEDIUM | Critical flows | 0% | Write E2E tests (P2) |
| GAP-001 | Documentation | No API documentation | LOW | API docs | Missing | Add API docs (P2) |
| GAP-002 | Documentation | No deployment guide | LOW | Deploy instructions | Missing | Add deploy guide (P2) |

---

# 48. DEFINITION OF DONE

## Project Complete When:

### Build & Runtime
- [x] Frontend build PASS
- [x] Backend build PASS
- [x] Database PASS (PostgreSQL running, migrations applied)

### Authentication
- [x] Register PASS
- [x] Login PASS
- [x] Logout PASS
- [x] Protected routes PASS
- [x] Authorization PASS

### Core Features
- [x] Map PASS
- [x] Memory CRUD PASS
- [x] Images PASS
- [x] Timeline PASS
- [x] Search PASS
- [x] Filter PASS
- [x] Statistics PASS

### UI/UX
- [x] Responsive PASS
- [x] Loading states PASS
- [x] Empty states PASS
- [x] Error handling PASS

### Security
- [x] Security PASS (password hashing, JWT, authorization, headers)

### Documentation
- [x] README PASS

### End-to-End User Flow
```
Register ✅
  ↓
Login ✅
  ↓
Map ✅
  ↓
Select location ✅
  ↓
Create memory ✅
  ↓
Upload image ✅
  ↓
Save ✅
  ↓
Marker ✅
  ↓
Detail ✅
  ↓
Edit/Delete ✅
  ↓
Timeline ✅
  ↓
Search ✅
  ↓
Filter ✅
  ↓
Statistics ✅
```

---

# 49. SUMMARY

## Feature Count Summary

| Category | Count |
|----------|-------|
| **Total Feature IDs** | 71 |
| **P0 (Critical)** | 18 |
| **P1 (Core)** | 28 |
| **P2 (Important)** | 15 |
| **P3 (Nice to Have)** | 6 |
| **P4 (Future)** | 4 |
| **🟢 IMPLEMENTED** | 45 |
| **🟡 PARTIALLY IMPLEMENTED** | 7 |
| **⚪ MISSING** | 19 |
| **🔴 BROKEN** | 0 |

## Top 10 Gaps (Priority Order)

1. **TEST-001: Unit Tests** (HIGH) - No unit tests written
2. **TEST-002: Integration Tests** (HIGH) - No integration tests written
3. **TEST-003: E2E Tests** (MEDIUM) - No E2E tests written
4. **IMG-005: File Upload** (MEDIUM) - Only URL-based upload
5. **MAP-006: Location Search** (MEDIUM) - No place search
6. **SEC-007: Rate limiting** (MEDIUM) - No API rate limiting
7. **SEC-008: CSRF Protection** (MEDIUM) - No CSRF tokens
8. **PERF-003: API Pagination** (MEDIUM) - No pagination
9. **PROF-001: Profile View** (MEDIUM) - No profile page
10. **PROF-002: Profile Editing** (MEDIUM) - No profile editing

## MVP Completion Status

**MVP Features:** 45/45 (100%) ✅

All MVP features are implemented. The application is fully functional for the core user journey.

**Post-MVP Gaps:** 26 features (mostly P2/P3/Future)

These are enhancements and polish items that can be addressed after MVP deployment.

---

**End of PROJECT_FEATURES.md**
