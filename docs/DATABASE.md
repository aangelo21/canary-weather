# Database Documentation

This document describes the database schema, relationships, and management for the CanaryWeather application.

## Database Overview

- **Database Type**: MySQL 8.0+
- **ORM**: Sequelize v6
- **Migrations**: Sequelize CLI
- **Hosting**: DigitalOcean Managed MySQL

## Database Schema

### Tables Overview

| Table                | Description                           | Key Relationships                               |
| -------------------- | ------------------------------------- | ----------------------------------------------- |
| Users (Deprecated)   | *Replaced by LDAP*                    | -                                               |
| Locations            | Geographic locations (municipalities) | Has many UserLocations                          |
| PointsOfInterest     | Points of interest with coordinates   | Has many UserPOIs, Forecasts                    |
| Alerts               | Weather alerts and warnings           | Has many Notifications                          |
| Notifications        | User notifications                    | Belongs to Alert (User link via LDAP username)  |
| Forecasts            | Weather forecast data                 | Belongs to PointOfInterest                      |
| UserLocations        | User-location associations            | Belongs to Location (User link via LDAP username)|
| UserPointsOfInterest | User-POI associations                 | Belongs to POI (User link via LDAP username)    |
| Sessions             | Express session storage               | -                                               |

## Table Schemas

### Users (Deprecated)

*Note: User authentication and management is now handled via LDAP. This table is no longer the source of truth for active users.*

### Locations

```sql
CREATE TABLE Locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aemet_code VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

**Fields**:

- `id`: Auto-increment primary key
- `aemet_code`: AEMET API location code
- `name`: Location name
- `latitude`, `longitude`: Geographic coordinates

### PointsOfInterest

```sql
CREATE TABLE PointsOfInterest (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  type ENUM('local', 'global', 'personal') NOT NULL,
  image_url VARCHAR(255),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

**Fields**:

- `id`: UUID primary key
- `name`: POI name
- `description`: POI description
- `latitude`, `longitude`: Geographic coordinates
- `type`: POI type (local/global/personal)
- `image_url`: Path to POI image

### Alerts

```sql
CREATE TABLE Alerts (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
  location_id INT,
  start_time DATETIME,
  end_time DATETIME,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (location_id) REFERENCES Locations(id)
);
```

**Fields**:

- `id`: UUID primary key
- `title`: Alert title
- `description`: Alert details
- `severity`: Alert severity level
- `location_id`: Associated location (optional)
- `start_time`, `end_time`: Alert validity period

### Notifications

```sql
CREATE TABLE Notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL, -- LDAP Username
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
  -- No Foreign Key to Users table
);
```

**Fields**:

- `id`: UUID primary key
- `user_id`: Associated user (LDAP Username)
- `message`: Notification message
- `is_read`: Read status flag

### UserLocations

```sql
CREATE TABLE UserLocations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL, -- LDAP Username
  location_id INT NOT NULL,
  selected_at DATETIME NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (location_id) REFERENCES Locations(id) ON DELETE CASCADE
  -- No Foreign Key to Users table
);
```

**Fields**:

- `id`: Auto-increment primary key
- `user_id`: Associated user (LDAP Username)
- `location_id`: Associated location
- `selected_at`: When location was added

### UserPointsOfInterest

```sql
CREATE TABLE UserPointsOfInterest (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL, -- LDAP Username
  point_of_interest_id VARCHAR(36) NOT NULL,
  favorited_at DATETIME NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (point_of_interest_id) REFERENCES PointsOfInterest(id) ON DELETE CASCADE
  -- No Foreign Key to Users table
);
```

**Fields**:

- `id`: Auto-increment primary key
- `user_id`: Associated user (LDAP Username)
- `point_of_interest_id`: Associated POI
- `favorited_at`: When POI was favorited

## Entity Relationships

```
User (LDAP) ── (Logical Link) ──< (N) UserLocation (N) ──────> (1) Location
     │
     └──────── (Logical Link) ──< (N) UserPointOfInterest (N) ──────> (1) PointOfInterest
     │                                                                  │
     └──────── (Logical Link) ──< (N) Notification (N) ──────> (1) Alert      │
                                                                      │
                                                         └──────< (N) Forecast
```

## Database Migrations

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

```bash
npx sequelize-cli migration:generate --name migration-name
```

### Migration Best Practices

1. **Never modify existing migrations** - Create new ones instead
2. **Test migrations** on development database first
3. **Include rollback logic** in `down` method
4. **Document breaking changes** in migration comments
5. **Backup database** before running migrations in production

## Database Seeders

### Available Seeders

```bash
# Seed users
npm run seed:users

# Seed points of interest
npm run seed:pois

# Seed alerts
npm run seed:alerts

# Seed forecasts
npm run seed:forecasts

# Seed user locations
npm run seed:user-locations

# Seed user POIs
npm run seed:user-pois

# Run all seeders
npm run seed:all
```

### Creating New Seeders

```bash
npx sequelize-cli seed:generate --name seeder-name
```

## Database Backup and Restore

### Backup

```bash
mysqldump -u username -p canary_weather > backup.sql
```

### Restore

```bash
mysql -u username -p canary_weather < backup.sql
```

## Performance Optimization

### Indexes

Current indexes:

- Primary keys on all tables
- Unique index on `Users.email`
- Foreign key indexes automatically created

### Query Optimization

1. **Use Sequelize includes** for eager loading
2. **Limit result sets** with pagination
3. **Select specific fields** instead of `SELECT *`
4. **Use indexes** for frequently queried fields

### Example Optimized Query

```javascript
// Bad - N+1 query problem
const users = await User.findAll();
for (const user of users) {
  const locations = await user.getLocations();
}

// Good - Eager loading
const users = await User.findAll({
  include: [{ model: Location }],
});
```

## Database Maintenance

### Regular Tasks

1. **Backups**: Daily automated backups (DigitalOcean Managed MySQL)
2. **Monitoring**: Check database performance metrics
3. **Cleanup**: Remove old sessions and expired data
4. **Optimization**: Analyze slow queries and add indexes

### Monitoring Queries

```sql
-- Check table sizes
SELECT
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'canary_weather'
ORDER BY size_mb DESC;

-- Check slow queries
SHOW FULL PROCESSLIST;
```

## Connection Configuration

### Development

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=canary_weather
DB_DIALECT=mysql
DB_PORT=3306
```

### Production

```env
DB_HOST=your-managed-db-host.db.ondigitalocean.com
DB_USER=doadmin
DB_PASSWORD=your-secure-password
DB_NAME=canary_weather
DB_DIALECT=mysql
DB_PORT=25060
DB_SSL=true
```

## Troubleshooting

### Common Issues

**Connection Refused**

```bash
# Check MySQL is running
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql
```

**Migration Errors**

```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Undo last migration
npm run migrate:undo
```

**Seeder Errors**

```bash
# Clear all data and reseed
npx sequelize-cli db:seed:undo:all
npm run seed:all
```

For more troubleshooting, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

---

**Related Documentation**:

- [Architecture Overview](ARCHITECTURE.md)
- [Backend Documentation](BACKEND.md)
- [API Documentation](api.md)
