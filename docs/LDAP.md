# LDAP

LDAP (Lightweight Directory Access Protocol) is an open, vendor-neutral protocol used for accessing and managing directory information services over an IP network. It enables applications to query and modify user, group, and organizational data stored in a centralized directory, commonly used for authentication, authorization, and user management in enterprise environments.

## Instalation

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

The project uses the `LdapService` to interact with the LDAP directory for user management and authentication. This service replaces the traditional database-based user management.

### Service Location

- **File**: `backend/services/ldapService.js`
- **Configuration**:
  - **LDAP URL**: `ldap://134.209.22.118`
  - **Base DN**: `dc=canaryweather,dc=xyz`
  - **Users OU**: `ou=users,dc=canaryweather,dc=xyz`
  - **Groups OU**: `ou=groups,dc=canaryweather,dc=xyz`

### Available Methods

#### 1. **authenticate(identifier, password)**

Authenticates a user against the LDAP server.

- **Parameters**:
  - `identifier`: Username or email
  - `password`: User password
- **Returns**: User object with `{username, email, isAdmin}` or `null` if authentication fails
- **Process**:
  1. Binds as admin to search for user
  2. Searches for user by `cn` (username) or `mail` (email)
  3. Binds as the user to verify password
  4. Checks group membership to determine admin status

**Example**:
```javascript
const user = await LdapService.authenticate(username, password);
if (user) {
  console.log(`Welcome ${user.username}!`);
  console.log(`Admin: ${user.isAdmin}`);
}
```

#### 2. **createUser(username, email, password, isAdmin = false)**

Creates a new user in LDAP directory.

- **Parameters**:
  - `username`: User's username (becomes `cn`)
  - `email`: User's email address
  - `password`: User's password (stored hashed by LDAP)
  - `isAdmin`: Optional flag to add user to admins group
- **Returns**: `{username, email}` on success
- **Process**:
  1. Binds as admin
  2. Creates user entry with `inetOrgPerson` objectClass
  3. Adds user to `normals` group
  4. Optionally adds to `admins` group

**Example**:
```javascript
await LdapService.createUser('john_doe', 'john@example.com', 'securepass123');
```

#### 3. **userExists(username)**

Checks if a user exists in LDAP.

- **Parameters**: `username`
- **Returns**: `true` or `false`

#### 4. **getAllUsers()**

Retrieves all users from LDAP with their admin status.

- **Returns**: Array of user objects with `{username, email, id, is_admin, createdAt}`
- **Process**:
  1. Searches for all `inetOrgPerson` entries
  2. Checks each user's group membership
  3. Determines admin status

#### 5. **updateUser(username, {email, password, is_admin})**

Updates user information in LDAP.

- **Parameters**:
  - `username`: User to update
  - Options object with:
    - `email`: New email (optional)
    - `password`: New password (optional)
    - `is_admin`: Admin status (optional)
- **Process**:
  1. Updates user attributes (email, password)
  2. Manages admin group membership

#### 6. **deleteUser(username)**

Deletes a user from LDAP.

- **Parameters**: `username`
- **Process**:
  1. Removes user from all groups
  2. Deletes user entry

### Integration with Controllers

The LDAP service is integrated in `userController.js`:

**Login Flow**:
```javascript
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  
  // Authenticate against LDAP
  const user = await LdapService.authenticate(username, password);
  
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  // Set session
  req.session.user = {
    id: user.username,
    username: user.username,
    is_admin: user.isAdmin
  };
  
  // Generate JWT token
  const token = jwt.sign({ 
    id: user.username, 
    username: user.username, 
    is_admin: user.isAdmin 
  }, JWT_SECRET, { expiresIn: '15m' });
  
  return res.json({ user: req.session.user, token });
};
```

**Registration Flow**:
```javascript
export const createUser = async (req, res) => {
  const { email, username, password } = req.body;
  
  // Check if user exists
  const exists = await LdapService.userExists(username);
  if (exists) {
    return res.status(409).json({ error: "User already exists" });
  }
  
  // Create in LDAP
  await LdapService.createUser(username, email, password);
  
  // Create related database records (UserLocation, UserPointOfInterest)
  // Send welcome email
  // Set session and return JWT
};
```

### Data Storage Model

With LDAP integration, the system uses a **hybrid approach**:

- **LDAP**: User credentials, email, admin status
- **MySQL**: User preferences (locations, POIs, notifications)
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

