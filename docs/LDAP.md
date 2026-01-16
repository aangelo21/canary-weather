# CanaryWeather LDAP Configuration Guide

LDAP (Lightweight Directory Access Protocol) is an open, vendor-neutral protocol used for accessing and managing directory information services over an IP network. It enables applications to query and modify user, group, and organizational data stored in a centralized directory, commonly used for authentication, authorization, and user management in enterprise environments.

---

## Architecture Overview

CanaryWeather uses a **hybrid authentication system** that combines LDAP and MySQL database:

**LDAP Storage**:
- Email addresses
- Usernames
- User unique identifiers (ldap_id)
- Group memberships (admins, normals)

**MySQL Database Storage**:
- Encrypted passwords (bcrypt)
- LDAP ID references
- User profiles and preferences
- Application-specific data

**Why Hybrid?**
- **Security**: Passwords are encrypted and stored separately from LDAP
- **Flexibility**: Password management handled independently
- **Centralization**: User identity data in LDAP for directory queries
- **Scalability**: Database and LDAP can scale independently

---

## Installation

### 1. Update system repositories

Make sure your system repositories are update with the command: 

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install LDAP

Install the main packages with:

```bash
sudo apt install slapd ldap-utils -y
```

- **slapd**: LDAP server
- **ldap-utils**: command line tools (ldapadd, ldapsearch, ldapmodify, ldapdelete)

During the installation you will be asked to add your LDAP admin password. In case you want to reconfigure LDAP run the following command:

```bash
dpkg-reconfigure slapd
```

### 3. Verify LDAP service

To verify is LDAP is running run:

```bash
sudo systemctl status slapd
```

If done correctly, you should see **active(running)**

## Configuration

### 1. Base configuration

![base configuration](/docs/public/ldap/base.ldif.png)

### 2. OUs configuration

![OUs configuration](/docs/public/ldap/ous.ldif.png)

### 3. Admins configuration

![Admins configuration](/docs/public/ldap/admins.ldif.png)

### 4. Normal users configuration

![Normal users configuration](/docs/public/ldap/normals.ldif.png)

## LDAP Service & Integration

The project uses the `LdapService` to interact with the LDAP directory for user management. The service works in conjunction with the MySQL database to provide a secure hybrid authentication system.

### Service Location

- **File**: `backend/services/ldapService.js`
- **Configuration** (`.env`):
  ```env
  LDAP_URL=ldap://134.209.22.118
  LDAP_ADMIN_DN=cn=admin,dc=canaryweather,dc=xyz
  LDAP_ADMIN_PASSWORD=xsbn$B3P9R34aysk0E6!
  ```
- **LDAP Structure**:
  - **Base DN**: `dc=canaryweather,dc=xyz`
  - **Users OU**: `ou=users,dc=canaryweather,dc=xyz`
  - **Groups OU**: `ou=groups,dc=canaryweather,dc=xyz`

---

## Available Methods

#### 1. **getUserByUsername(identifier)**

Retrieves user information from LDAP without password validation.

- **Parameters**:
  - `identifier`: Username or email to search
- **Returns**: User object with `{username, email, ldapId, isAdmin}` or `null` if not found
- **Use Case**: Used during login to verify user exists in LDAP after password validation in database
- **Process**:
  1. Binds as admin to LDAP
  2. Searches for user by `cn` (username) or `mail` (email)
  3. Retrieves user attributes (username, email, uid/ldapId)
  4. Checks group membership to determine admin status

**Example**:
```javascript
const ldapUser = await LdapService.getUserByUsername('johndoe');
if (ldapUser) {
  console.log(`User found: ${ldapUser.username}`);
  console.log(`LDAP ID: ${ldapUser.ldapId}`);
}
```

#### 2. **createUser(username, email, isAdmin = false)**

Creates a new user in LDAP directory (without password).

- **Parameters**:
  - `username`: User's username (becomes `cn`)
  - `email`: User's email address
  - `isAdmin`: Optional flag to add user to admins group
- **Returns**: `{username, email, ldapId}` on success
- **Note**: Passwords are **NOT** stored in LDAP, only in MySQL database
- **Process**:
  1. Binds as admin
  2. Generates unique UUID (`ldapId`)
  3. Creates user entry with `inetOrgPerson` objectClass
  4. Stores username, email, and uid (ldapId)
  5. Adds user to `normals` group
  6. Optionally adds to `admins` group

**Example**:
```javascript
const result = await LdapService.createUser('john_doe', 'john@example.com');
console.log(`User created with LDAP ID: ${result.ldapId}`);
```

#### 3. **userExists(username)**

Checks if a user exists in LDAP.

- **Parameters**: `username`
- **Returns**: `true` or `false`
- **Use Case**: Used during registration to prevent duplicate usernames

**Example**:
```javascript
const exists = await LdapService.userExists('johndoe');
if (exists) {
  throw new Error('Username already taken');
}
```

#### 4. **getAllUsers()**

Retrieves all users from LDAP with their admin status.

- **Returns**: Array of user objects with `{username, email, id, is_admin, createdAt}`
- **Process**:
  1. Searches for all `inetOrgPerson` entries
  2. Checks each user's group membership
  3. Determines admin status

#### 5. **updateUser(username, {email, is_admin})**

Updates user information in LDAP.

- **Parameters**:
  - `username`: User to update
  - Options object with:
    - `email`: New email (optional)
    - `is_admin`: Admin status (optional)
- **Note**: Passwords are updated in MySQL database, not LDAP
- **Process**:
  1. Updates user attributes (email)
  2. Manages admin group membership

#### 6. **deleteUser(username)**

Deletes a user from both LDAP and MySQL database.

- **Parameters**: `username`
- **Integration**: Called automatically when deleting a user from the system
- **Process**:
  1. Binds as admin to LDAP
  2. Searches for all groups containing the user
  3. Removes user from all groups (normals, admins)
  4. Deletes user entry from LDAP
  5. Deletes user record from MySQL database

**Example**:
```javascript
await LdapService.deleteUser('johndoe');
```

**Important**: This operation is **irreversible**. Both LDAP and database records are permanently deleted.

---

## Authentication Flow

### User Registration

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /api/users
       │ {username, email, password}
       ▼
┌──────────────────────────────────┐
│  userManagementService.js        │
│                                  │
│  1. Validate fields              │
│  2. Check duplicates in DB       │
│  3. Check if username exists     │◄──┐
│     in LDAP                      │   │
└──────────┬───────────────────────┘   │
           │                           │
           │                    ┌──────┴────────┐
           ▼                    │  LdapService  │
    ┌──────────────┐           │               │
    │ Create user  │──────────►│  createUser() │
    │ in LDAP      │           │  - username   │
    └──────┬───────┘           │  - email      │
           │                    │  - generates  │
           │                    │    ldapId     │
           ▼                    └───────────────┘
    ┌──────────────┐
    │ Encrypt      │
    │ password     │
    │ with bcrypt  │
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────┐
    │ Save in MySQL:       │
    │ - username           │
    │ - email              │
    │ - password (hashed)  │
    │ - ldap_id            │
    └──────┬───────────────┘
           │
           ▼
    ┌──────────────┐
    │ Return JWT   │
    │ token        │
    └──────────────┘
```

### User Login

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /api/users/login
       │ {username, password}
       ▼
┌──────────────────────────────────┐
│  authService.js                  │
│                                  │
│  1. Find user in MySQL DB        │
│     by username                  │
└──────────┬───────────────────────┘
           │
           ▼
    ┌──────────────────┐
    │ Compare password │
    │ with bcrypt      │
    │ (stored in DB)   │
    └──────┬───────────┘
           │
           │ ✓ Password valid
           ▼
┌──────────────────────────────────┐
│  Verify user exists in LDAP      │◄──┐
└──────────┬───────────────────────┘   │
           │                           │
           │                    ┌──────┴────────────┐
           ▼                    │  LdapService      │
    ┌──────────────┐           │                   │
    │ User found   │──────────►│ getUserByUsername │
    │ in LDAP      │           │ - returns email   │
    └──────┬───────┘           │ - returns ldapId  │
           │                    │ - returns isAdmin │
           │                    └───────────────────┘
           ▼
    ┌──────────────┐
    │ Return JWT   │
    │ token        │
    └──────────────┘
```

### User Deletion

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ DELETE /api/users/:id
       │ (authenticated)
       ▼
┌──────────────────────────────────┐
│  userController.js               │
│                                  │
│  1. Find user in MySQL DB        │
│     by ID                        │
└──────────┬───────────────────────┘
           │
           │ ✓ User found
           ▼
    ┌──────────────────┐
    │ Delete from LDAP │◄──┐
    │ by username      │   │
    └──────┬───────────┘   │
           │               │
           │        ┌──────┴────────────┐
           ▼        │  LdapService      │
    ┌──────────────┐│                   │
    │ LDAP cleanup││  deleteUser()     │
    │ - Remove from││  1. Remove from   │
    │   groups    ││     all groups    │
    │ - Delete    ││  2. Delete user   │
    │   entry     ││     entry         │
    └──────┬───────┘└───────────────────┘
           │
           ▼
    ┌──────────────────────┐
    │ Delete from MySQL:   │
    │ - User record        │
    │ - UserLocations      │
    │ - UserPOIs           │
    │ - Notifications      │
    │ (cascade delete)     │
    └──────┬───────────────┘
           │
           ▼
    ┌──────────────┐
    │ Return       │
    │ success      │
    └──────────────┘
```

---

## Database Integration

### User Model

The `User` model in MySQL stores:

```javascript
{
  id: UUID (primary key, auto-generated),
  username: STRING,
  email: STRING,
  password: STRING (bcrypt hashed),
  ldap_id: UUID (reference to LDAP uid),
  profile_picture_url: STRING,
  is_admin: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Key Relationships

```
LDAP Entry                    MySQL User Table
┌──────────────────┐         ┌──────────────────┐
│ cn: johndoe      │         │ username         │
│ mail: john@...   │◄───────►│ email            │
│ uid: uuid-123... │         │ ldap_id: uuid-123│
│ groups: normals  │         │ password: $2b$..│
└──────────────────┘         │ is_admin: false  │
                             └──────────────────┘
```

---

## Security Considerations

### Password Security

1. **Passwords never stored in LDAP**: All passwords are encrypted with bcrypt and stored only in MySQL
2. **Salt rounds**: bcrypt uses 10 salt rounds for encryption
3. **Password validation**: Handled through bcrypt.compare() in database layer
4. **No plaintext**: Passwords never transmitted or stored in plaintext

### LDAP Security

1. **Admin credentials**: Stored in `.env` file, not in code
2. **Bind operations**: All LDAP operations bind as admin user
3. **Group-based permissions**: Admin status determined by LDAP group membership
4. **Unique identifiers**: Each user has a unique UUID (`ldap_id`) generated on creation

### Token Security

1. **JWT expiration**: Tokens expire after 15 minutes
2. **Signed tokens**: All tokens are cryptographically signed
3. **Session management**: Sessions stored in database with expiration

---

## Migration to Hybrid System

The system was migrated from full LDAP authentication to a hybrid approach:

**Migration**: `20260116163813-add-ldap-id-password-to-users.cjs`

**Changes Made**:
1. Added `ldap_id` field to User table (UUID, unique)
2. Added `password` field to User table (STRING, bcrypt hashed)
3. Modified `createUser()` to not store passwords in LDAP
4. Modified `authenticateUser()` to validate password in database
5. Added `getUserByUsername()` for LDAP verification without auth

**Why Migrate?**
- Improved security with bcrypt password hashing
- Easier password management (reset, update)
- Separation of concerns (identity in LDAP, credentials in DB)
- Better compliance with modern security standards

---

## Troubleshooting

### Common Issues

**1. Cannot connect to LDAP**
- Verify LDAP server is running: `sudo systemctl status slapd`
- Check LDAP_URL in `.env` file
- Verify network connectivity to LDAP server

**2. User creation fails**
- Check LDAP_ADMIN_DN and LDAP_ADMIN_PASSWORD are correct
- Verify base DN structure exists in LDAP
- Check that groups (normals, admins) exist

**3. Authentication fails**
- Verify user exists in both LDAP and MySQL
- Check password is correctly hashed in database
- Verify ldap_id matches between LDAP and MySQL

**4. Admin status not working**
- Check user is member of `cn=admins,ou=groups,dc=canaryweather,dc=xyz`
- Verify group membership query in `checkGroups()` function

### LDAP Commands

**Search for user**:
```bash
ldapsearch -x -H ldap://134.209.22.118 -b "ou=users,dc=canaryweather,dc=xyz" "(cn=username)"
```

**List all users**:
```bash
ldapsearch -x -H ldap://134.209.22.118 -b "ou=users,dc=canaryweather,dc=xyz" "(objectClass=inetOrgPerson)"
```

**Check group membership**:
```bash
ldapsearch -x -H ldap://134.209.22.118 -b "ou=groups,dc=canaryweather,dc=xyz" "(uniqueMember=cn=username,ou=users,dc=canaryweather,dc=xyz)"
```

---
  - `UserLocation` stores `user_id` as username (string)
  - `UserPointOfInterest` stores `user_id` as username (string)
  - No foreign key constraints to Users table

### Environment Variables

Required environment variables:

```env
LDAP_ADMIN_DN=cn=admin,dc=canaryweather,dc=xyz
LDAP_ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret
```

### Error Handling

The service handles common LDAP errors:
- Connection failures
- Authentication errors
- User not found
- Duplicate user creation
- Group membership errors

All methods return promises and can be used with async/await.

