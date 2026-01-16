# CanaryWeather Diagrams Documentation

This document contains various diagrams that visualize the structure and relationships within the CanaryWeather application.

---

## Use Case Diagram
```mermaid
graph LR
    User((User))
    Admin((Administrator))
    API((External API))

    subgraph CanaryWeather
        UC1(Login and Registration)
        UC2(Check Weather)
        UC3(Save Locations and POIs)
        UC4(View Alerts)
        UC5(Manage Global POIs)
        UC6(Manage Users)
        UC7(Generate Forecasts)
        UC8(Generate Alerts)
    end

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4

    Admin --> UC5
    Admin --> UC6

    API --> UC7
    API --> UC8
```

## Class Diagram

```mermaid
classDiagram
    class User {
        +String username
        +String email
        +bool isAdmin
    }
    
    class POI {
        +int id
        +String name
        +double latitude
        +double longitude
        +bool in_global
        +String image_url
        +enum type
    }

    class Location {
        +int id
        +String aemet_code
        +String name
        +double latitude
        +double longitude
    }

    class Forecast {
        +int id
        +double temperature
        +String condition
        +int humidity
        +int air_pressure
        +double wind_speed
        +int poi_id
    }
    
    class Alert {
        +int id
        +enum level
        +String phenomenon
        +date start_date
        +date end_date
        +int location_id
    }

    class UserLocation {
        +int id
        +String user_id
        +int location_id
    }
    
    class UserPOI {
        +int id
        +String user_id
        +int poi_id
    }
    
    class Notification {
        +int id
        +String message
        +enum type
        +datetime sent_at
        +String user_id
        +int alert_id
    }
    
    User "1" .. "0..*" UserLocation : logical_link
    User "1" .. "0..*" UserPOI : logical_link
    
    POI "1" *-- "0..*" Forecast : has_weather_data 
    
    UserLocation "0..*" --* "1" Location : points_to

    UserPOI "0..*" --* "1" POI : points_to
    
    Alert "1" *-- "0..*" Notification : generates
    User "1" .. "0..*" Notification : receives_via
```

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||..o{ UserLocation : has_saved
    User ||..o{ UserPOI : saves_poi
    
    POI ||--o{ Forecast : has_weather_data 
    
    UserLocation }|--|| Location : points_to

    UserPOI }|--|| POI : points_to
    
    Alert ||--o{ Notification : generates
    User ||..o{ Notification : receives_via
    
    User {
        String username PK
        String email
        bool isAdmin
    }
    
    POI {
        int id PK
        String name
        double latitude
        double longitude
        bool in_global
        String image_url
        enum type
    }

    Location {
        int id PK
        String aemet_code
        String name
        double latitude
        double longitude
    }

    Forecast {
        int id PK
        double temperature
        String condition
        int humidity
        int air_pressure
        double wind_speed
        int poi_id FK
    }
    
    Alert {
        int id PK
        enum level
        String phenomenon
        date start_date
        date end_date
    }

    UserLocation {
        int id PK
        String user_id
        int location_id FK
    }
    
    UserPOI {
        int id PK
        String user_id
        int poi_id FK
    }
    
    Notification {
        int id PK
        String message
        enum type
        datetime sent_at
        String user_id
        int alert_id FK
    }
```