# CanaryWeather System Diagrams

This document provides visual representations of the Canary Weather application system. All diagrams use Mermaid format to show use cases, class structures, and database relationships.

---

## 1. Use Case Diagram

This diagram shows what different users can do in the Canary Weather system.

```mermaid
graph TB
    User["User"]
    Admin["Admin User"]
    System["Canary Weather System"]
    
    User -->|Login with LDAP| System
    User -->|View Weather Forecasts| System
    User -->|Manage Alerts| System
    User -->|Save Locations| System
    User -->|Save Points of Interest| System
    User -->|Receive Notifications| System
    User -->|Subscribe to Push Notifications| System
    
    Admin -->|Manage All Users| System
    Admin -->|View System Logs| System
    Admin -->|Delete Users| System
    Admin -->|Manage Alert Rules| System
```

### Use Case Description

- **Login**: Users authenticate using LDAP credentials (username and password).
- **View Weather Forecasts**: Users can see current and future weather information for locations and points of interest.
- **Manage Alerts**: Users create, update, or delete weather alerts based on their saved locations.
- **Save Locations**: Users can save cities or geographic areas they want to monitor.
- **Save Points of Interest**: Users can save specific locations like parks, beaches, or landmarks.
- **Receive Notifications**: When alerts are triggered, users receive notifications through the app.
- **Subscribe to Push Notifications**: Users can receive push notifications on their devices.
- **Admin Functions**: Administrators have additional permissions to manage the entire system.

---

## 2. Class Diagram

This diagram shows the main classes (models) in the backend and their relationships.

```mermaid
classDiagram
    class User {
        id: UUID
        email: string
        username: string
        profile_picture_url: string
        is_admin: boolean
        createdAt: date
        updatedAt: date
    }
    
    class Location {
        id: UUID
        name: string
        latitude: float
        longitude: float
        municipality: string
        createdAt: date
        updatedAt: date
    }
    
    class PointOfInterest {
        id: UUID
        name: string
        latitude: float
        longitude: float
        description: string
        category: string
        createdAt: date
        updatedAt: date
    }
    
    class UserLocation {
        id: UUID
        user_id: UUID
        location_id: UUID
        created_at: date
    }
    
    class UserPointOfInterest {
        id: UUID
        user_id: UUID
        point_of_interest_id: UUID
        created_at: date
    }
    
    class Alert {
        id: UUID
        user_id: UUID
        location_id: UUID
        type: string
        condition: string
        is_active: boolean
        created_at: date
        updated_at: date
    }
    
    class Notification {
        id: UUID
        user_id: UUID
        alert_id: UUID
        message: string
        is_read: boolean
        created_at: date
        updated_at: date
    }
    
    class Forecast {
        id: UUID
        poi_id: UUID
        temperature: float
        humidity: float
        wind_speed: float
        description: string
        forecast_date: date
        created_at: date
    }
    
    class UserProfile {
        id: UUID
        user_id: UUID
        language: string
        theme: string
        notifications_enabled: boolean
        updated_at: date
    }
    
    class PushSubscription {
        id: UUID
        user_id: UUID
        endpoint: string
        auth: string
        p256dh: string
        device_name: string
        created_at: date
    }
    
    User "1" -- "*" UserLocation
    User "1" -- "*" UserPointOfInterest
    User "1" -- "*" Alert
    User "1" -- "*" Notification
    User "1" -- "*" UserProfile
    User "1" -- "*" PushSubscription
    
    Location "1" -- "*" UserLocation
    Location "1" -- "*" Alert
    
    PointOfInterest "1" -- "*" UserPointOfInterest
    PointOfInterest "1" -- "*" Forecast
    
    Alert "1" -- "*" Notification
```

### Class Descriptions

- **User**: Represents a person who uses the application. Stores authentication info and profile data.
- **Location**: A geographic area like a city or municipality that users want to monitor.
- **PointOfInterest**: A specific location like a beach, park, or landmark.
- **UserLocation**: Links users to their saved locations (many-to-many relationship).
- **UserPointOfInterest**: Links users to their saved points of interest (many-to-many relationship).
- **Alert**: A notification rule set by a user for a specific location (e.g., alert if temperature drops below 5°C).
- **Notification**: A message sent to a user when their alert conditions are met.
- **Forecast**: Weather prediction data for a specific point of interest.
- **UserProfile**: User preferences and settings (language, theme, notification settings).
- **PushSubscription**: Information needed to send push notifications to a user's device.

---

## 3. Entity-Relationship Diagram (ERD)

This diagram shows how database tables relate to each other.

```mermaid
erDiagram
    USERS ||--o{ USER_LOCATIONS : saves
    USERS ||--o{ USER_POINTS_OF_INTEREST : saves
    USERS ||--o{ ALERTS : creates
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ USER_PROFILES : has
    USERS ||--o{ PUSH_SUBSCRIPTIONS : subscribes
    
    LOCATIONS ||--o{ USER_LOCATIONS : contained_in
    LOCATIONS ||--o{ ALERTS : triggers
    
    POINTS_OF_INTEREST ||--o{ USER_POINTS_OF_INTEREST : contained_in
    POINTS_OF_INTEREST ||--o{ FORECASTS : has
    
    ALERTS ||--o{ NOTIFICATIONS : sends
    
    USERS {
        uuid id PK
        string email UK
        string username
        string profile_picture_url
        boolean is_admin
        timestamp createdAt
        timestamp updatedAt
    }
    
    LOCATIONS {
        uuid id PK
        string name
        float latitude
        float longitude
        string municipality
        timestamp createdAt
        timestamp updatedAt
    }
    
    POINTS_OF_INTEREST {
        uuid id PK
        string name
        float latitude
        float longitude
        string description
        string category
        timestamp createdAt
        timestamp updatedAt
    }
    
    USER_LOCATIONS {
        uuid id PK
        uuid user_id FK
        uuid location_id FK
        timestamp created_at
    }
    
    USER_POINTS_OF_INTEREST {
        uuid id PK
        uuid user_id FK
        uuid point_of_interest_id FK
        timestamp created_at
    }
    
    ALERTS {
        uuid id PK
        uuid user_id FK
        uuid location_id FK
        string type
        string condition
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        uuid alert_id FK
        string message
        boolean is_read
        timestamp created_at
        timestamp updated_at
    }
    
    FORECASTS {
        uuid id PK
        uuid poi_id FK
        float temperature
        float humidity
        float wind_speed
        string description
        date forecast_date
        timestamp created_at
    }
    
    USER_PROFILES {
        uuid id PK
        uuid user_id FK
        string language
        string theme
        boolean notifications_enabled
        timestamp updated_at
    }
    
    PUSH_SUBSCRIPTIONS {
        uuid id PK
        uuid user_id FK
        string endpoint
        string auth
        string p256dh
        string device_name
        timestamp created_at
    }
```

### Entity Descriptions

- **USERS**: Core table storing user account information and admin status.
- **LOCATIONS**: Geographic areas (cities, regions) that users follow.
- **POINTS_OF_INTEREST**: Specific landmarks, beaches, parks, or notable places.
- **USER_LOCATIONS**: Junction table connecting users to locations they follow.
- **USER_POINTS_OF_INTEREST**: Junction table connecting users to points of interest they follow.
- **ALERTS**: Rules that trigger notifications based on weather conditions.
- **NOTIFICATIONS**: Messages sent to users when alerts are triggered.
- **FORECASTS**: Weather prediction data linked to points of interest.
- **USER_PROFILES**: Settings and preferences for each user.
- **PUSH_SUBSCRIPTIONS**: Device information for sending push notifications.

---

## 4. System Architecture Diagram

This diagram shows how the frontend, backend, and database communicate.

```mermaid
graph TB
    Client["Web Browser"]
    Frontend["Frontend<br/>React + Vite"]
    API["Backend API<br/>Node.js + Express"]
    Auth["LDAP Server<br/>Authentication"]
    DB["MySQL Database"]
    Notification["Push Notification<br/>Service"]
    
    Client -->|HTTP/HTTPS| Frontend
    Frontend -->|API Calls<br/>JSON| API
    API -->|Verify Credentials| Auth
    API -->|Query/Update| DB
    API -->|Send Notifications| Notification
    DB -->|Return Data| API
    Auth -->|Confirm User| API
    Notification -->|Push to Device| Client
```

### Flow Explanation

1. **User Opens Browser**: Connects to the React frontend application.
2. **User Logs In**: Credentials are sent to the backend API.
3. **API Verifies**: Checks username and password against LDAP server.
4. **JWT Token Issued**: If login succeeds, user gets a JWT token for future requests.
5. **User Actions**: Frontend sends API requests with the JWT token.
6. **API Processes**: Backend queries the MySQL database and performs actions.
7. **Notifications**: When alerts trigger, notifications are sent to user devices via push service.

---

## 5. Alert Workflow Diagram

This diagram shows how alerts are created and triggered.

```mermaid
graph TD
    A["User Saves a Location"]
    B["User Creates an Alert<br/>for that Location"]
    C["Alert Stored in Database<br/>is_active = true"]
    D["Weather System Fetches<br/>Current Conditions"]
    E["Compare to Alert Condition<br/>e.g., Temperature < 5°C"]
    F["Condition Met?"]
    G["Send Notification<br/>to User"]
    H["User Receives<br/>Notification"]
    I["User Can Mark<br/>as Read"]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F -->|Yes| G
    F -->|No| D
    G --> H
    H --> I
```

---

## 6. Authentication Flow Diagram

This diagram shows how users log in and stay authenticated.

```mermaid
graph LR
    A["User Enters<br/>Credentials"]
    B["Send to Backend<br/>POST /api/users/login"]
    C["Check LDAP<br/>Server"]
    D["User Found?"]
    E["Create JWT Token<br/>Lifetime: 15 min"]
    F["Return Token<br/>to Frontend"]
    G["Store in Session<br/>Lifetime: 24 hours"]
    H["Frontend Stores Token<br/>in Browser"]
    I["Token Expires?"]
    J["Use Refresh Token<br/>POST /api/users/refresh-token"]
    K["Get New Token"]
    L["Continue Using App"]
    
    A --> B
    B --> C
    C --> D
    D -->|No| D
    D -->|Yes| E
    E --> F
    F --> G
    G --> H
    H --> L
    L --> I
    I -->|Yes| J
    I -->|No| L
    J --> K
    K --> H
```

### Token Details

- **JWT Token**: Valid for 15 minutes. Required for all API requests.
- **Session Cookie**: Stored on server. Valid for 24 hours.
- **Refresh Token**: Used to get a new JWT token when the current one expires.
- **Token Storage**: Frontend stores the JWT token in browser memory (not localStorage for security).

---

## 7. Data Flow Diagram

This diagram shows how data moves through the system when a user views weather information.

```mermaid
graph TD
    U["User"]
    FE["Frontend<br/>React"]
    API["Backend<br/>API"]
    CACHE["Cache<br/>Optional"]
    DB["Database<br/>MySQL"]
    EXT["External<br/>Weather API"]
    
    U -->|Clicks 'View Weather'| FE
    FE -->|GET /api/locations| API
    API -->|Check Cache| CACHE
    CACHE -->|Miss| DB
    DB -->|Return Locations| API
    API -->|Fetch Weather<br/>from External Source| EXT
    EXT -->|Weather Data| API
    API -->|Send to Frontend| FE
    FE -->|Display on Map<br/>with Data| U
```

---

## Summary

These diagrams provide a complete visual overview of:

- **What users do** (Use Case Diagram)
- **What classes exist** (Class Diagram)
- **How data is stored** (Entity-Relationship Diagram)
- **How components interact** (System Architecture)
- **How alerts work** (Alert Workflow)
- **How authentication works** (Authentication Flow)
- **How data moves** (Data Flow)

For more detailed information about specific areas, refer to other documentation files:
- `ARCHITECTURE.md` for system design
- `DATABASE.md` for database schema
- `AUTHENTICATION.md` for login details