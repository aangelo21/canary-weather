# CanaryWeather Database Documentation

This document explains the database structure, tables, relationships, and how data is organized in the CanaryWeather application.

---

## Overview

The CanaryWeather application uses PostgreSQL as its relational database management system, hosted on Render. The database stores all application data including users, weather alerts, points of interest, notifications, and user preferences.

**Database Name**: canaryweather

---

## Database Architecture

### Data Storage Strategy

All data is stored in PostgreSQL:
- User accounts (with bcrypt-hashed passwords)
- User preferences
- Weather alerts
- Points of interest
- Notifications
- User locations
- User-POI relationships

---

## Main Tables

### 1. Users Table

**Purpose**: Stores user accounts and profile information

**Column Details**:
- `id` (UUID, Primary Key): Unique user identifier
- `email` (String): User email address
- `username` (String): User display name
- `password` (String): Bcrypt-hashed password
- `profile_picture_url` (String, Nullable): Path to profile image
- `is_admin` (Boolean): Admin privileges flag
- `createdAt` (DateTime): Account creation date
- `updatedAt` (DateTime): Last update timestamp

**Example Data**:
```
| id         | email              | profile_picture_url | is_admin | createdAt | updatedAt |
|------------|--------------------|-------------------|----------|-----------|-----------|
| johndoe    | john@example.com   | /uploads/john.jpg | false    | 2024-01-01| 2024-01-15|
| admin_user | admin@example.com  | /uploads/admin.jpg| true     | 2024-01-01| 2024-01-10|
```

**Relationships**:
- One user can have many locations
- One user can have many notifications
- One user can have many personal POIs

---

### 2. Locations Table

**Purpose**: Stores municipalities and cities in the Canary Islands

**Column Details**:
- `id` (Integer, Primary Key): Unique location identifier
- `name` (String): City or municipality name
- `latitude` (Float): GPS latitude coordinate
- `longitude` (Float): GPS longitude coordinate
- `createdAt` (DateTime): Creation date
- `updatedAt` (DateTime): Last update timestamp

**Example Data**:
```
| id | name                      | latitude | longitude | createdAt | updatedAt |
|----|---------------------------|----------|-----------|-----------|-----------|
| 1  | Las Palmas                | 28.1235  | -15.4363  | 2024-01-01| 2024-01-01|
| 2  | Santa Cruz de Tenerife    | 28.4635  | -16.2519  | 2024-01-01| 2024-01-01|
| 3  | Maspalomas                | 27.7412  | -15.5898  | 2024-01-01| 2024-01-01|
```

**Relationships**:
- One location can have many alerts
- One location can be monitored by many users
- One location can have many POIs

---

### 3. Alerts Table

**Purpose**: Stores weather alerts and warnings

**Column Details**:
- `id` (String, UUID Primary Key): Unique alert identifier
- `title` (String): Alert title (e.g., "Strong Wind Warning")
- `description` (String, Nullable): Detailed alert information
- `severity` (Enum): Level of danger
  - Values: low, medium, high, critical
- `location_id` (Integer, Foreign Key): Affected location
- `start_time` (DateTime, Nullable): When alert starts
- `end_time` (DateTime, Nullable): When alert ends
- `createdAt` (DateTime): When alert was created
- `updatedAt` (DateTime): Last update timestamp

**Example Data**:
```
| id   | title          | description | severity | location_id | start_time | end_time | createdAt |
|------|----------------|-------------|----------|-------------|------------|----------|-----------|
| UUID1| Strong Wind    | 80 km/h     | high     | 1           | 2024-01-15 | 2024-01-15| 2024-01-15|
| UUID2| Heavy Rain     | 50mm rain   | medium   | 2           | 2024-01-20 | 2024-01-20| 2024-01-20|
```

**Relationships**:
- Many alerts can affect one location
- One alert can create many notifications
- One alert is created by one admin user

---

### 4. Notifications Table

**Purpose**: Stores user notifications

**Column Details**:
- `id` (String, UUID Primary Key): Unique notification identifier
- `user_id` (String, Foreign Key): User receiving notification
- `message` (String): Notification message
- `is_read` (Boolean): Whether user has read the notification
- `createdAt` (DateTime): When notification was sent
- `updatedAt` (DateTime): Last update timestamp

**Example Data**:
```
| id   | user_id | message                    | is_read | createdAt |
|------|---------|----------------------------|---------|-----------|
| UUID1| johndoe | Strong wind in Las Palmas  | false   | 2024-01-15|
| UUID2| johndoe | Heavy rain alert issued    | true    | 2024-01-20|
```

**Relationships**:
- Many notifications belong to one user
- One notification may be related to one alert

---

### 5. PointsOfInterest Table

**Purpose**: Stores special places (beaches, mountains, restaurants, etc.)

**Column Details**:
- `id` (String, UUID Primary Key): Unique POI identifier
- `name` (String): Name of the place
- `description` (String, Nullable): Details about the place
- `latitude` (Float): GPS latitude coordinate
- `longitude` (Float): GPS longitude coordinate
- `type` (Enum): Type of POI
  - Values: global, local, personal
- `image_url` (String, Nullable): URL to POI image
- `created_by` (String, Foreign Key): User who created it
- `createdAt` (DateTime): Creation date
- `updatedAt` (DateTime): Last update timestamp

**Example Data**:
```
| id   | name              | latitude | longitude | type     | created_by | createdAt |
|------|-------------------|----------|-----------|----------|-----------|-----------|
| UUID1| Teide Park        | 28.3722  | -16.6435  | global   | admin     | 2024-01-01|
| UUID2| My Beach          | 27.7412  | -15.5898  | personal | johndoe   | 2024-01-15|
```

**Relationships**:
- One POI is created by one user
- One POI can be in one location
- One POI can be marked as favorite by many users

---

### 6. UserLocations Table

**Purpose**: Stores which locations each user wants to monitor

**Column Details**:
- `id` (Integer, Primary Key): Unique relationship identifier
- `user_id` (String, Foreign Key): User identifier
- `location_id` (Integer, Foreign Key): Location identifier
- `createdAt` (DateTime): When user started monitoring
- `updatedAt` (DateTime): Last update timestamp

**Example Data**:
```
| id | user_id | location_id | createdAt |
|----|---------|-------------|-----------|
| 1  | johndoe | 1           | 2024-01-01|
| 2  | johndoe | 2           | 2024-01-15|
| 3  | johndoe | 3           | 2024-01-20|
```

**Purpose**: Links users to locations they want to monitor for weather alerts

**Relationships**:
- One user can have many locations
- One location can be monitored by many users

---

### 7. UserPointsOfInterest Table

**Purpose**: Stores which POIs each user marks as favorites

**Column Details**:
- `id` (Integer, Primary Key): Unique relationship identifier
- `user_id` (String, Foreign Key): User identifier
- `poi_id` (String, UUID Foreign Key): POI identifier
- `createdAt` (DateTime): When user marked as favorite
- `updatedAt` (DateTime): Last update timestamp

**Example Data**:
```
| id | user_id | poi_id | createdAt |
|----|---------|--------|-----------|
| 1  | johndoe | UUID1  | 2024-01-10|
| 2  | johndoe | UUID2  | 2024-01-15|
```

**Purpose**: Allows users to save and organize their favorite places

**Relationships**:
- One user can have many favorite POIs
- One POI can be favorited by many users

---

## Table Relationships

### Relationship Diagram

```
Users (1) ------> (M) UserLocations (M) ------> (1) Locations (1) ------> (M) Alerts
  |                                                     |
  |                                                     |
  (1) ------> (M) Notifications <------ (M) Alerts     |
  |                                                     |
  (1) ------> (M) PointsOfInterest                    |
  |                 |
  |                 |
  (1) ------> (M) UserPointsOfInterest (M) ----> (1)
```

**Legend**:
- (1) = One
- (M) = Many
- -----> = Relationship direction

---

## Common Data Queries

### Example 1: Get All Alerts for a User's Locations

```sql
SELECT DISTINCT a.*
FROM Alerts a
JOIN UserLocations ul ON a.location_id = ul.location_id
WHERE ul.user_id = 'johndoe';
```

**Purpose**: Find all weather alerts for cities the user monitors

---

### Example 2: Get User's Favorite POIs

```sql
SELECT p.*
FROM PointsOfInterest p
JOIN UserPointsOfInterest upi ON p.id = upi.poi_id
WHERE upi.user_id = 'johndoe';
```

**Purpose**: Retrieve all saved places for a user

---

### Example 3: Get Unread Notifications

```sql
SELECT *
FROM Notifications
WHERE user_id = 'johndoe' AND is_read = false;
```

**Purpose**: Show user their unread messages

---

### Example 4: Create User Alert Subscription

```sql
INSERT INTO UserLocations (user_id, location_id, createdAt, updatedAt)
VALUES ('johndoe', 1, NOW(), NOW());
```

**Purpose**: Subscribe user to weather alerts for a location

---

## Data Types

### String (VARCHAR)
Used for: usernames, email, messages, descriptions
- Maximum length: 255 characters

### Text
Used for: long descriptions, detailed alert information
- No maximum length

### Integer
Used for: IDs, counts, numeric values
- Range: -2,147,483,648 to 2,147,483,647

### Float
Used for: GPS coordinates (latitude, longitude)
- Precision: 6 decimal places

### DateTime
Used for: timestamps, dates, times
- Format: YYYY-MM-DD HH:MM:SS

### Boolean
Used for: flags (is_read, is_admin)
- Values: true (1) or false (0)

### UUID
Used for: unique identifiers that are generated
- Format: 550e8400-e29b-41d4-a716-446655440000

### Enum
Used for: fixed set of values
- Examples: severity (low, medium, high, critical)

---

## Database Constraints

### Primary Keys
- Every table has a primary key
- Primary keys must be unique
- Primary keys cannot be NULL

### Foreign Keys
- Link tables together
- Ensure referential integrity
- Prevent deleting records that are still in use

### NOT NULL Constraints
- Some fields cannot be empty
- Example: user email cannot be NULL

### UNIQUE Constraints
- Some fields must be unique across all rows
- Example: username cannot be duplicated

---

## Indexes for Performance

**Indexed Columns** (for faster searches):
- `user_id` in Notifications table
- `location_id` in Alerts table
- `user_id` in UserLocations table
- `created_by` in PointsOfInterest table

**Why indexes matter**:
- Faster searches for users
- Faster alert retrieval
- Better performance for notifications

---

## Data Integrity Rules

### Rule 1: Users Cannot Have Duplicate Emails
- Each user must have a unique email address
- Prevents account conflicts

### Rule 2: Alerts Must Have a Location
- Cannot create alert without specifying affected location
- Ensures users know where alert applies

### Rule 3: Notifications Cannot Exist Without User
- Must belong to an existing user
- Deleting user also deletes their notifications

---

## Backup and Recovery

### Backup Strategy
- Automated daily backups
- Backups stored in secure cloud storage
- Multiple backup copies maintained

### Recovery Process
If data is corrupted or lost:
1. Restore from most recent backup
2. Verify data integrity
3. Restart application
4. Notify users if necessary

---

## Database Maintenance

### Regular Tasks
- Check database size and growth
- Monitor query performance
- Clean up old expired data
- Verify backup completion
- Check for errors in logs

### Optimization
- Indexes are maintained automatically
- Query optimization for slow operations
- Database statistics updated regularly

---

## Connection Information

### Development Environment
```
Host: localhost
Port: 5432
Database: canaryweather
User: postgres
Password: (from .env file)
```

### Production Environment
```
Host: (Render PostgreSQL internal host)
Port: 5432
Database: (from environment variables)
User: (from environment variables)
Password: (from environment variables)
```

### Environment Variables (.env)
```
DB_HOST=database_host
DB_USER=database_user
DB_PASSWORD=database_password
DB_NAME=canaryweather
DB_PORT=5432
DB_DIALECT=postgres
```

---

## Migrations

### What are Migrations?

Migrations are scripts that create or modify the database structure. They allow version control of database changes.

### Running Migrations

```bash
# Run all pending migrations
npm run migrate

# Undo last migration
npm run migrate:undo

# Undo all migrations
npm run migrate:undo:all
```

### Creating New Migrations

When you need to change the database structure:
1. Create a new migration file
2. Define the changes (add/remove columns, create tables)
3. Run migration to apply changes
4. Test to ensure no data loss

---

## Security

### Password Storage
- Passwords hashed with bcrypt before storage
- Never stored in plain text

### Data Encryption
- Passwords passed through environment variables (not code)
- SSL available if database requires it

### Access Control
- Database credentials not in version control
- Access restricted to backend application only
- Frontend cannot access database directly
- Regular access logs maintained

### SQL Injection Prevention
- All queries use parameterized statements
- User input always validated
- Framework (Sequelize) prevents SQL injection automatically

---

## Troubleshooting

### Problem: Cannot Connect to Database

**Solutions**:
1. Check if database server is running
2. Verify host and port are correct
3. Check username and password
4. Verify network connectivity
5. Check firewall rules

### Problem: Slow Queries

**Solutions**:
1. Check if indexes are in place
2. Review query performance logs
3. Optimize complex queries
4. Add new indexes if needed
5. Archive old data if database is large

### Problem: Disk Space Full

**Solutions**:
1. Compress old logs
2. Archive historical data
3. Delete old sessions
4. Increase storage capacity
5. Contact database administrator

---

## Summary

The CanaryWeather database:
- Stores all application data in PostgreSQL (including user credentials with bcrypt)
- Uses 7 main tables with clear relationships
- Includes security measures for data protection
- Maintains data integrity through constraints
- Provides fast access through indexes
- Supports automatic backups and recovery

The database design ensures:
- Data consistency
- Fast performance
- Security
- Easy maintenance
- Scalability for growth

For questions about specific tables or data relationships, refer to the relevant sections above or contact the development team.