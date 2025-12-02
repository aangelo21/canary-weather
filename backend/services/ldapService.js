import ldap from 'ldapjs';

const LDAP_URL = 'ldap://134.209.22.118';
const BASE_DN = 'dc=canaryweather,dc=xyz';
const USERS_DN = `ou=users,${BASE_DN}`;
const GROUPS_DN = `ou=groups,${BASE_DN}`;
const ADMINS_GROUP_DN = `cn=admins,${GROUPS_DN}`;
const NORMALS_GROUP_DN = `cn=normals,${GROUPS_DN}`;

// Helper to create a client
const createClient = () => {
  return ldap.createClient({
    url: LDAP_URL,
    // timeout: 5000,
    // connectTimeout: 10000
  });
};

export const LdapService = {
  /**
   * Authenticate a user against the LDAP server.
   * Returns user info including isAdmin status if successful, null otherwise.
   */
  authenticate: (identifier, password) => {
    return new Promise((resolve, reject) => {
      const client = createClient();
      
      // Admin credentials to search for the user DN
      const ADMIN_DN = 'cn=admin,dc=canaryweather,dc=xyz';
      const ADMIN_PASSWORD = 'xsbn$B3P9R34aysk0E6!';

      client.on('error', (err) => {
        console.error('LDAP Client Error:', err);
        client.unbind();
        resolve(null);
      });

      // 1. Bind as Admin to search for the user
      client.bind(ADMIN_DN, ADMIN_PASSWORD, (err) => {
        if (err) {
          console.error('LDAP Admin Bind Error (Auth):', err.message);
          client.unbind();
          return resolve(null);
        }

        // 2. Search for user by cn (username) or mail (email)
        const searchOpts = {
          filter: `(|(cn=${identifier})(mail=${identifier}))`,
          scope: 'sub',
          attributes: ['dn', 'cn']
        };

        client.search(USERS_DN, searchOpts, (err, res) => {
          if (err) {
            console.error('LDAP User Search Error:', err);
            client.unbind();
            return resolve(null);
          }

          let userEntry = null;

          res.on('searchEntry', (entry) => {
            userEntry = entry;
          });

          res.on('end', (result) => {
            if (!userEntry) {
              // User not found
              client.unbind();
              return resolve(null);
            }

            const userDN = userEntry.objectName.toString();
            
            // Get username from the entry if possible
            let username = identifier;
            if (userEntry.object && userEntry.object.cn) {
                username = userEntry.object.cn;
            } else if (userEntry.attributes) {
                 const cnAttr = userEntry.attributes.find(a => a.type === 'cn');
                 if (cnAttr && cnAttr.values && cnAttr.values.length) {
                     username = cnAttr.values[0];
                 }
            }

            // 3. Bind as the User to verify password
            client.bind(userDN, password, (err) => {
                if (err) {
                    console.error('LDAP User Bind Error:', err.message);
                    client.unbind();
                    return resolve(null);
                }

                // 4. Check groups
                const groupOpts = {
                    filter: `(uniqueMember=${userDN})`,
                    scope: 'sub',
                    attributes: ['cn']
                };

                client.search(GROUPS_DN, groupOpts, (err, res) => {
                    if (err) {
                        console.error('LDAP Group Search Error:', err);
                        client.unbind();
                        return reject(err);
                    }

                    const groups = [];
                    res.on('searchEntry', (entry) => {
                        if (entry.object) {
                            groups.push(entry.object.cn);
                        } else if (entry.attributes) {
                            const cn = entry.attributes.find(a => a.type === 'cn');
                            if (cn && cn.values && cn.values.length) {
                                groups.push(cn.values[0]);
                            }
                        }
                    });

                    res.on('end', () => {
                        client.unbind();
                        resolve({
                            username: username,
                            isAdmin: groups.includes('admins')
                        });
                    });

                    res.on('error', (err) => {
                        console.error('LDAP Group Search Event Error:', err);
                        client.unbind();
                        reject(err);
                    });
                });
            });
          });
          
          res.on('error', (err) => {
             console.error('LDAP Search Event Error:', err);
             client.unbind();
             reject(err);
          });
        });
      });
    });
  },

  /**
   * Create a new user in LDAP and add them to the 'normals' group.
   */
  createUser: (username, email, password) => {
    return new Promise((resolve, reject) => {
      const client = createClient();
      
      const ADMIN_DN = 'cn=admin,dc=canaryweather,dc=xyz';
      const ADMIN_PASSWORD = 'xsbn$B3P9R34aysk0E6!'; 

      client.bind(ADMIN_DN, ADMIN_PASSWORD, (err) => {
        if (err) {
          console.error('LDAP Admin Bind Error:', err);
          client.unbind();
          return reject(new Error('Failed to bind to LDAP as admin'));
        }

        const userDN = `cn=${username},${USERS_DN}`;
        
        const entry = {
          cn: username,
          sn: username, // Surname is mandatory in inetOrgPerson
          mail: email,
          objectClass: ['inetOrgPerson', 'top'],
          userPassword: password
        };

        client.add(userDN, entry, (err) => {
          if (err) {
            console.error('LDAP Add User Error:', err);
            client.unbind();
            return reject(err);
          }

          // Add to normals group
          const change = new ldap.Change({
            operation: 'add',
            modification: {
              type: 'uniqueMember',
              values: [userDN]
            }
          });

          client.modify(NORMALS_GROUP_DN, change, (err) => {
            client.unbind();
            if (err) {
              console.error('LDAP Add to Group Error:', err);
              // User created but group add failed
              return resolve({ username, email, warning: 'User created but failed to add to group' });
            }
            resolve({ username, email });
          });
        });
      });
    });
  },
  
  /**
   * Check if a user exists
   */
  userExists: (username) => {
    return new Promise((resolve, reject) => {
      const client = createClient();
      const opts = {
        filter: `(cn=${username})`,
        scope: 'sub',
        attributes: ['cn']
      };

      client.search(USERS_DN, opts, (err, res) => {
        if (err) {
          client.unbind();
          return reject(err);
        }

        let found = false;
        res.on('searchEntry', (entry) => {
          found = true;
        });

        res.on('end', (result) => {
          client.unbind();
          resolve(found);
        });
        
        res.on('error', (err) => {
           client.unbind();
           reject(err);
        });
      });
    });
  }
};
