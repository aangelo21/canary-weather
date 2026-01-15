# CanaryWeather API Testing Guide
## Simple Guide for Everyone

---

## What is This?

This guide will help you **test all the features** of CanaryWeather directly from your web browser. You don't need to install anything special. It's like taking a "test drive" of the system.

You can access it here: **https://canaryweather.xyz/api/docs**

---

## Step 1: Open the Testing Page

### Instructions:

1. Open your web browser (Chrome, Firefox, Safari, Edge, etc.)
2. Go to this link: `https://canaryweather.xyz/api/docs`
3. You should see a page with blue design and many buttons

### What You'll See:

On the page you'll find:
- **Title**: "CanaryWeather API" at the top
- **Colored Buttons**:
  - Blue = Getting information (view)
  - Green = Creating things (new)
  - Orange = Changing things (edit)
  - Red = Deleting things

---

## Step 2: Create a Test Account

### Why?
You need an account to test most features.

### Instructions:

1. **Look for "Users" section** (or "Authentication")
2. **Find the green button** that says "Register new user"
3. **Click on it** to expand
4. **Click "Try it out"** button

### Now fill in the form:

You'll see text fields. Complete like this:

| Field | Example | What It Means |
|-------|---------|--------------|
| **email** | yourname@gmail.com | Your real email |
| **username** | myuser2024 | Your unique username (no spaces) |
| **password** | MyPassword123! | A strong password |
| **location_ids** | [1, 2, 3] | City numbers (optional) |

**Tips for a good password**:
- Use UPPERCASE letters
- Use lowercase letters
- Use numbers
- At least 8 characters long

4. **Click "Execute"** button

### What Happens?

You'll see a green message below like this:

```json
{
  "user": {
    "id": "myuser2024",
    "email": "yourname@gmail.com",
    "username": "myuser2024",
    "is_admin": false
  }
}
```

**Your account is created!**

---

## Step 3: Log In

### Instructions:

1. **Look for "Authentication" section**
2. **Find the green button** "Login user"
3. **Click "Try it out"**

### Fill with your information:

```json
{
  "username": "myuser2024",
  "password": "MyPassword123!"
}
```

4. **Click "Execute"**

### What You'll Receive:

You'll see a message like this:

```json
{
  "user": {
    "id": "myuser2024",
    "email": "yourname@gmail.com",
    "username": "myuser2024",
    "is_admin": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**IMPORTANT**: Copy the "token" (that long text after "token":)

---

## Step 4: Authorize Your Access

Now you must tell the system: "It's me, myuser2024"

### Instructions:

1. **Find the "Authorize" button** at the top of the page
2. **Click on it**
3. A small window will open
4. **Paste the token** that you copied from the previous step
5. **Click "Authorize"** again

Now you're authorized to use all features.

---

## Step 5: See All Available Cities

### Why?
To know which cities you can monitor.

### Instructions:

1. **Look for "Users" section**
2. **Find the blue button** "Get all municipalities"
3. **Click "Try it out"**
4. **Click "Execute"**

### What You'll See:

A list like this:

```json
[
  {
    "id": 1,
    "name": "Las Palmas",
    "latitude": 28.1235,
    "longitude": -15.4363
  },
  {
    "id": 2,
    "name": "Santa Cruz de Tenerife",
    "latitude": 28.4635,
    "longitude": -16.2519
  }
]
```

**Note**: The numbers (28.1235, -15.4363) are **GPS location coordinates**. You don't need to understand them.

---

## Step 6: View All Weather Alerts

### Why?
To see what bad weather warnings are active now.

### Instructions:

1. **Look for "Alerts" section**
2. **Find the blue button** "Get all alerts"
3. **Click "Try it out"**
4. **Click "Execute"**

### What You'll See:

A list of alerts like:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Strong wind warning",
    "description": "Wind speeds up to 80 km/h expected",
    "severity": "high",
    "location_id": 1,
    "start_time": "2024-01-15T10:00:00Z",
    "end_time": "2024-01-15T18:00:00Z"
  }
]
```

**Explanation**:
- **title**: What the alert is about (wind, rain, etc.)
- **description**: More details
- **severity**: How serious is it?
  - low = Notice
  - medium = Moderate
  - high = Serious
  - critical = Very serious
- **start_time / end_time**: When it starts and ends

---

## Step 7: Create a New Alert

### Why?
If you're an administrator, you can create new alerts.

### Instructions:

1. **Look for "Alerts" section**
2. **Find the green button** "Create alert"
3. **Click "Try it out"**

### Fill in the fields:

```json
{
  "title": "Heavy rain",
  "description": "50mm of rain expected in 24 hours",
  "severity": "medium",
  "location_id": 2,
  "start_time": "2024-01-20T06:00:00Z",
  "end_time": "2024-01-20T18:00:00Z"
}
```

**Field Explanations**:
- **title**: Short name for the alert
- **description**: More details (optional)
- **severity**: How serious (low, medium, high, critical)
- **location_id**: City number affected
- **start_time**: When it starts (format: year-month-day T hour:minute:second Z)
- **end_time**: When it ends

4. **Click "Execute"**

### What Happens?

If everything is correct, you'll see a green message with your alert created.

---

## Step 8: See Special Places (Points of Interest)

### Why?
To see beaches, mountains, parks and other interesting places.

### Instructions:

1. **Look for "Points of Interest" section**
2. **Find the blue button** "Get all POIs"
3. **Click "Try it out"**
4. **Click "Execute"**

### What You'll See:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Teide National Park",
    "description": "Spain's highest mountain",
    "latitude": 28.3722,
    "longitude": -16.6435,
    "type": "global",
    "image_url": "https://canaryweather.xyz/uploads/pois/teide.jpg"
  }
]
```

**Explanation**:
- **name**: Name of the place
- **description**: What is this place
- **latitude / longitude**: Where it is (GPS coordinates)
- **type**: Type of place
  - "global" = Famous place
  - "local" = Local place
  - "personal" = Your personal place

---

## Step 9: Add Your Own Special Place

### Instructions:

1. **Look for "Points of Interest" section**
2. **Find the green button** "Create POI"
3. **Click "Try it out"**

### Fill in the information:

```json
{
  "name": "My Favorite Beach",
  "description": "A beautiful beach in Gran Canaria",
  "latitude": 27.7412,
  "longitude": -15.5898,
  "type": "personal"
}
```

**Explanation**:
- **name**: Name of your place
- **description**: Why it's special
- **latitude / longitude**: Where it is (you can copy from Google Maps)
- **type**: Choose "personal" for your places

4. **Click "Execute"**

---

## Step 10: View Your Notifications

### Why?
To see messages that the system sent to you.

### Instructions:

1. **Look for "Notifications" section**
2. **Find the blue button** "Get notifications"
3. **Click "Try it out"**
4. **Click "Execute"**

### What You'll See:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "myuser2024",
    "message": "Strong wind warning in Las Palmas",
    "is_read": false
  }
]
```

**Explanation**:
- **message**: The message you received
- **is_read**: false = Not read, true = Already read

---

## Step 11: Manage Your Favorite Cities

### See your favorite cities:

1. **Look for "User Locations" section**
2. **Find the blue button** "Get user locations"
3. **Click "Try it out"**
4. **Click "Execute"**

### Add a new city:

1. **Find the green button** "Add location to user"
2. **Click "Try it out"**
3. Fill with the city number:

```json
{
  "location_id": 3
}
```

4. **Click "Execute"**

### Remove a city:

1. **Find the red button** "Remove location from user"
2. **Click "Try it out"**
3. Enter the city number to remove
4. **Click "Execute"**

---

## Step 12: View Your User Profile

### Instructions:

1. **Look for "Users" section**
2. **Find the blue button** "Get current authenticated user"
3. **Click "Try it out"**
4. **Click "Execute"**

### What You'll See:

Your profile information:

```json
{
  "id": "myuser2024",
  "email": "yourname@gmail.com",
  "username": "myuser2024",
  "is_admin": false
}
```

---

## Step 13: Change Your Profile

### Instructions:

1. **Look for "Users" section**
2. **Find the orange button** "Update user"
3. **Click "Try it out"**
4. In the "id" field, type your username

### Fill in the changes:

```json
{
  "email": "newemail@gmail.com",
  "username": "myuser2024",
  "password": "MyNewPassword123!"
}
```

5. **Click "Execute"**

---

## Step 14: Refresh Your Access (Token)

### When to do this?

If you see a message "Token expired", you need to refresh.

**The token lasts 15 minutes**, so every 15 minutes you need to refresh if you want to keep using the system.

### Instructions:

1. **Look for "Authentication" section**
2. **Find the green button** "Refresh JWT token"
3. **Click "Try it out"**
4. **Click "Execute"**

### You'll receive a new token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

5. **Repeat Step 4** (Authorize again with the new token)

---

## Step 15: Log Out

### Instructions:

1. **Look for "Authentication" section**
2. **Find the green button** "Logout user"
3. **Click "Try it out"**
4. **Click "Execute"**

### What Happens?

You'll see:

```json
{
  "message": "Logged out successfully"
}
```

Session closed. You can't use protected features anymore.

---

## Common Problems and Solutions

### Problem 1: "401 Unauthorized" (Not Authorized)

**What it means**: The system doesn't recognize you.

**How to fix it**:
1. Log in again (Step 3)
2. Copy the new token
3. Authorize again (Step 4)

---

### Problem 2: "404 Not Found" (Not Found)

**What it means**: The thing you're looking for doesn't exist.

**How to fix it**:
1. Check that you typed the correct number/ID
2. List all items (example: view all alerts)
3. Copy the exact ID from the list

---

### Problem 3: "400 Bad Request" (Incorrect Request)

**What it means**: There's an error in the data you sent.

**How to fix it**:
1. Review the fields you completed
2. Make sure you wrote the data correctly
3. Don't forget required fields (example: title, severity)
4. Check email format is correct (user@domain.com)

---

### Problem 4: "409 Conflict" (Conflict)

**What it means**: That item already exists (example: email already registered).

**How to fix it**:
1. Use a different email
2. Use a different username
3. Check if you already created that item

---

### Problem 5: The field has strange "JSON" format

**What it means**: You need to write the data in a special format.

**How to do it**:
- Follow the examples exactly
- Don't forget quotes around text
- Don't forget the curly brackets { } at the start and end
- Separate fields with commas

Wrong:
```
{
  title: "My Alert"
  severity: high
}
```

Correct:
```json
{
  "title": "My Alert",
  "severity": "high"
}
```

---

## Summary of What You Can Test

### Authentication
- Sign up
- Log in
- Refresh access
- Log out

### User Profile
- View my profile
- Change email or password
- View my favorite cities
- Add new cities
- Remove cities

### Weather Alerts
- View all alerts
- View one alert
- Create new alert
- Change an alert
- Delete an alert

### Special Places
- View all places
- View one place
- Create my own place
- Change place information
- Delete a place

### Notifications
- View all my notifications
- Mark as read
- Delete a notification

---

## Helpful Tips

### 1. Save Your Password
   - Use a strong one (UPPERCASE + lowercase + numbers)
   - Don't share it

### 2. Copy the IDs
   - When you see long numbers (like "550e8400-..."), copy them exactly
   - Use them when you need to find something

### 3. Take Your Time
   - Read the fields before completing them
   - Check your data before clicking "Execute"

### 4. Keep Your Token Fresh
   - Refresh the token every 15 minutes
   - If you see "Token expired", follow Step 14

### 5. Test Without Fear
   - This is a test environment
   - You can create, change and delete data
   - No one will be affected

---

## Need Help?

If something doesn't work:

1. **Check this guide** - Look for your problem in "Common Problems"
2. **Read the error message** - It tells you what went wrong
3. **Try again** - Sometimes you just need to retry
4. **Contact the team** - Use the "Contact" button in the app

---

## Contact Information

**Email**: support@canaryweather.com

---

## Simple Glossary

| Word | Meaning |
|------|---------|
| **API** | System to talk with the application |
| **Token** | Code that proves it's you |
| **Authorize** | Give permission to the system to act as you |
| **JSON** | Format to write information on the internet |
| **Execute** | Run / Do / Send |
| **POI** | Point of Interest (special place) |
| **Alert** | Warning about bad weather |
| **Notification** | Message you received |
| **Municipality** | City or town |
| **Severity** | Level of seriousness or importance |
| **Green Button** | For creating new things |
| **Blue Button** | For viewing things |
| **Orange Button** | For changing things |
| **Red Button** | For deleting things |

---

## Checklist Before Each Test

Before each test, make sure:

- I'm on the correct page (canaryweather.xyz/api/docs)
- I have my token copied
- I'm authorized (I clicked "Authorize")
- I completed all required fields
- Email has correct format (if needed)
- I checked the data before clicking "Execute"

---

## Quick Test Sequence

Want to test everything quickly? Follow this order:

1. Create account (Step 2)
2. Log in (Step 3)
3. Authorize (Step 4)
4. View profile (Step 12)
5. View all cities (Step 5)
6. View alerts (Step 6)
7. View special places (Step 8)
8. View your notifications (Step 10)
9. Log out (Step 15)

That's it! You've tested the main features.

---

## Using on Mobile

You can also test from your phone:

1. Open the same link in your phone browser
2. Follow the same steps
3. The page will adapt to your phone screen
4. Tap the buttons instead of clicking

---

## Security Tips

- Never share your token with anyone
- Never share your password with anyone
- Change your password if you suspect someone knows it
- Log out when you're done testing
- Use a strong password (not "123456" or "password")

---

## Token Expiration Times

- Token duration: 15 minutes
- Maximum session: 24 hours
- If token expires, use Step 14 to refresh

---

## API Availability

The API is available at:
- API Docs: https://canaryweather.xyz/api/docs
- Health Check: https://canaryweather.xyz/api/health

---

## Congratulations!

You now know how to test the CanaryWeather API!

If you have questions, review the "Common Problems" section or contact the support team.

**Last Updated**: 2024
**Version**: 1.0.0
**Language**: English (Simple Version)