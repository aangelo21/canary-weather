# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of CanaryWeather seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Disclose Publicly

Please **do not** create a public GitHub issue for security vulnerabilities.

### 2. Report Privately

Send an email to: **security@canaryweather.com** (or the project maintainer's email)

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity (see below)

### Severity Levels

| Severity | Response Time | Fix Timeline |
| -------- | ------------- | ------------ |
| Critical | Immediate     | 24-48 hours  |
| High     | 24 hours      | 7 days       |
| Medium   | 48 hours      | 30 days      |
| Low      | 7 days        | 90 days      |

## Security Best Practices

### For Users

1. **Strong Passwords**

   - Use passwords with at least 8 characters
   - Include uppercase, lowercase, numbers, and special characters
   - Don't reuse passwords from other services

2. **Keep Software Updated**

   - Regularly update to the latest version
   - Apply security patches promptly

3. **Secure Your Account**
   - Don't share your credentials
   - Log out when using shared computers
   - Monitor your account for suspicious activity

### For Developers

1. **Environment Variables**

   ```env
   # Never commit these to version control
   JWT_SECRET=use_a_strong_random_string_minimum_32_characters
   SESSION_SECRET=use_a_different_strong_random_string
   DB_PASSWORD=strong_database_password
   ```

2. **Dependencies**

   ```bash
   # Regularly check for vulnerabilities
   npm audit

   # Fix vulnerabilities
   npm audit fix
   ```

3. **Code Review**
   - All code changes require review
   - Security-sensitive changes require additional scrutiny
   - Use automated security scanning tools

## Known Security Considerations

### Authentication

- **JWT Tokens**: 15-minute expiry to limit exposure
- **Sessions**: 24-hour expiry with secure cookies
- **Password Hashing**: bcrypt with salt rounds
- **HTTPS**: Required in production

### Database

- **SQL Injection**: Prevented by Sequelize parameterized queries
- **Access Control**: Database credentials stored in environment variables
- **Backups**: Automated daily backups

### API Security

- **CORS**: Configured for specific origins
- **Rate Limiting**: Recommended for production
- **Input Validation**: All user inputs validated
- **XSS Protection**: React's built-in escaping

### File Uploads

- **File Type Validation**: Only images allowed
- **File Size Limits**: Maximum 5MB per file
- **Secure Storage**: Files stored outside web root
- **Sanitization**: Filenames sanitized

## Security Headers

Recommended security headers for production:

```javascript
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  next();
});
```

## Vulnerability Disclosure

When a security vulnerability is fixed:

1. **Patch Release**: Immediate patch release
2. **Security Advisory**: Published on GitHub
3. **Notification**: Users notified via email/announcement
4. **Credit**: Reporter credited (if desired)

## Security Checklist

### Before Deployment

- [ ] All environment variables set securely
- [ ] HTTPS enabled
- [ ] Database credentials rotated
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] File upload restrictions in place
- [ ] Error messages don't leak sensitive info
- [ ] Logging configured (no sensitive data logged)
- [ ] Dependencies updated and audited

### Regular Maintenance

- [ ] Weekly dependency audits
- [ ] Monthly security reviews
- [ ] Quarterly penetration testing
- [ ] Regular backup verification
- [ ] Access control reviews

## Common Vulnerabilities

### Prevented

✅ **SQL Injection**: Sequelize ORM with parameterized queries
✅ **XSS**: React's built-in escaping
✅ **CSRF**: SameSite cookies
✅ **Password Storage**: bcrypt hashing
✅ **Session Hijacking**: Secure, HttpOnly cookies

### Mitigated

⚠️ **Brute Force**: Implement rate limiting
⚠️ **DDoS**: Use CDN/load balancer
⚠️ **Man-in-the-Middle**: Enforce HTTPS

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Security](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## Contact

For security concerns, contact:

- **Email**: security@canaryweather.com
- **GitHub**: Create a security advisory

---

**Last Updated**: 2025-11-26
