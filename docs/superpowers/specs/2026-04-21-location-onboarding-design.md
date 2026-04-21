# Location Onboarding System — Design Spec

## Problem

First-time users land on the app with no location in localStorage. All API calls (weather, air quality, moon phase) require location params. Currently: silent failure, stuck loading spinner forever. No guidance, no fallback.

## Solution

App-level gate that blocks Layout from mounting until a valid location exists. Full-screen onboarding overlay for first-time users with three ways to set location.

## Decisions

| Decision | Choice |
|----------|--------|
| Initial location source | Browser Geolocation API |
| Fallback default | Ho Chi Minh City |
| Onboarding style | Full-screen overlay (blocks app) |
| Geolocation trigger | Explicit button click inside overlay (not on page load) |
| Returning users | Skip onboarding if localStorage has location |
| Approach | App-level gate — Layout only mounts when location exists |

## Architecture

```
App.vue
├── OnboardingGate.vue (new — checks location, gates everything)
│   ├── OnboardingOverlay.vue (new — shown when no location)
│   └── Layout.vue (existing — only mounts when location exists)
```

### OnboardingGate.vue

Wrapper component rendered by `App.vue` (replaces direct `<Layout />` usage).

- Reads `locationStore.location` reactively
- `v-if="!location"` → renders `OnboardingOverlay.vue`
- `v-else` → renders `Layout.vue`
- No router needed, pure reactive switch

### OnboardingOverlay.vue

Full-screen overlay with three location selection methods:

```
┌─────────────────────────────────────┐
│                                     │
│        Vue Weather                  │
│                                     │
│   "Choose your location to get      │
│    started with weather data"       │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Use My Location            │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Search for a city...       │   │
│   └─────────────────────────────┘   │
│   (search results dropdown here)    │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Use Ho Chi Minh City       │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Styling:** Dark theme matching existing app. Full viewport height, centered content. Tailwind classes.

### Button Behaviors

#### "Use My Location"

1. Click triggers `navigator.geolocation.getCurrentPosition()`
2. Show loading spinner on button while waiting
3. On success — construct Location object directly:
   ```ts
   {
     id: 0,
     name: "Current Location",
     latitude: pos.coords.latitude,
     longitude: pos.coords.longitude,
     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
     country_code: "",
     country: "",
     elevation: 0,
   }
   ```
4. On denied/error — show inline error: "Location access denied. Search or use default." Disable button.

No reverse geocoding. No extra API call. Weather backend only needs lat/lng/timezone.

Location name displays as "Current Location". User can search later via existing SearchModal for proper city name.

#### Search Box

- Reuse same API logic as `SearchModal.vue` — POST to `/geo_search` with `geoQuery` param
- Debounced input (500ms)
- Dropdown results below input
- Click result → set store → done

#### "Use Ho Chi Minh City"

Hardcoded Location object:
```ts
{
  id: 1566083,
  name: "Ho Chi Minh City",
  latitude: 10.8231,
  longitude: 106.6297,
  timezone: "Asia/Ho_Chi_Minh",
  country_code: "VN",
  country: "Vietnam",
  elevation: 19,
}
```
Click → set store → done. No API call.

## Data Flow

### First-time user (no localStorage)

```
App.vue → OnboardingGate.vue → location is null → OnboardingOverlay.vue
                                                    │
                   ┌────────────────────────────────┼────────────────────┐
                   │                                │                    │
          "Use My Location"                   Search box          "Use HCM"
                   │                                │                    │
      navigator.geolocation         POST /geo_search         hardcoded HCM
      → construct Location          → pick from results      Location object
                   │                                │                    │
                   └────────────────────────────────┼────────────────────┘
                                                    │
                                    locationStore.setLocationState(location)
                                    localStorage.setItem('location', ...)
                                                    │
                                    OnboardingGate detects location exists
                                                    │
                                    Layout.vue mounts → weather fetches
```

### Returning user (has localStorage)

```
App.vue → OnboardingGate.vue → location exists → Layout.vue → weather fetches
```

## Files Changed

| File | Change |
|------|--------|
| `src/components/OnboardingGate.vue` | **New** — location gate wrapper |
| `src/components/OnboardingOverlay.vue` | **New** — full-screen onboarding UI |
| `src/App.vue` | Swap `<Layout />` for `<OnboardingGate />` |
| `src/layout/Layout.vue` | Remove null-location error handling (location guaranteed by gate) |

## Files NOT Changed

- Weather/air/moon API calls — no changes
- Existing Pinia stores — no changes
- `SearchModal.vue` — no changes (still used for location changes by returning users)
- Backend — no changes
