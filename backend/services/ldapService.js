import ldap from 'ldapjs';
import bcrypt from 'bcrypt';

const LDAP_URL = 'ldap://134.209.22.118';
const BASE_DN = 'dc=canaryweather,dc=xyz';
const USERS_DN = `ou=users,${BASE_DN}`;
const GROUPS_DN = `ou=groups,${BASE_DN}`;
const ADMINS_GROUP_DN = `cn=admins,${GROUPS_DN}`;
const NORMALS_GROUP_DN = `cn=normals,${GROUPS_DN}`;

const checkGroups = (client, userDN, username, email, resolve, reject) => {
    const groupOpts = {
        filter: `(uniqueMember=${userDN})`,
        scope: 'sub',
        attributes: ['cn'],
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
                const cn = entry.attributes.find((a) => a.type === 'cn');
                if (cn && cn.values && cn.values.length) {
                    groups.push(cn.values[0]);
                }
            }
        });

        res.on('end', () => {
            client.unbind();
            resolve({
                username: username,
                email: email,
                isAdmin: groups.includes('admins'),
            });
        });

        res.on('error', (err) => {
            console.error('LDAP Group Search Event Error:', err);
            client.unbind();
            reject(err);
        });
    });
};


const createClient = () => {
    return ldap.createClient({
        url: LDAP_URL,
        
        
    });
};

export const LdapService = {
    
    authenticate: (identifier, password) => {
        return new Promise((resolve, reject) => {
            const client = createClient();

            
            const ADMIN_DN = process.env.LDAP_ADMIN_DN;
            const ADMIN_PASSWORD = process.env.LDAP_ADMIN_PASSWORD;

            client.on('error', (err) => {
                console.error('LDAP Client Error:', err);
                client.unbind();
                resolve(null);
            });

            
            client.bind(ADMIN_DN, ADMIN_PASSWORD, (err) => {
                if (err) {
                    console.error('LDAP Admin Bind Error (Auth):', err.message);
                    client.unbind();
                    return resolve(null);
                }

                
                const searchOpts = {
                    filter: `(|(cn=${identifier})(mail=${identifier}))`,
                    scope: 'sub',
                    attributes: ['dn', 'cn', 'mail', 'userPassword'],
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

                    res.on('end', async (result) => {
                        if (!userEntry) {
                            
                            client.unbind();
                            return resolve(null);
                        }

                        const userDN = userEntry.objectName.toString();

                        
                        let username = identifier;
                        let email = null;
                        let storedPassword = null;

                        if (userEntry.object) {
                            if (userEntry.object.cn)
                                username = userEntry.object.cn;
                            if (userEntry.object.mail)
                                email = userEntry.object.mail;
                            if (userEntry.object.userPassword)
                                storedPassword = userEntry.object.userPassword;
                        }

                        if (userEntry.attributes) {
                            const cnAttr = userEntry.attributes.find(
                                (a) => a.type === 'cn',
                            );
                            if (
                                cnAttr &&
                                cnAttr.values &&
                                cnAttr.values.length
                            ) {
                                username = cnAttr.values[0];
                            }
                            const mailAttr = userEntry.attributes.find(
                                (a) => a.type === 'mail',
                            );
                            if (
                                mailAttr &&
                                mailAttr.values &&
                                mailAttr.values.length
                            ) {
                                email = mailAttr.values[0];
                            }
                            const pwdAttr = userEntry.attributes.find(
                                (a) => a.type === 'userPassword',
                            );
                            if (
                                pwdAttr &&
                                pwdAttr.values &&
                                pwdAttr.values.length
                            ) {
                                storedPassword = pwdAttr.values[0];
                            }
                        }

                        
                        if (!storedPassword) {
                            console.error(
                                'LDAP Auth Error: No password stored for user',
                            );
                            client.unbind();
                            return resolve(null);
                        }

                        
                        const hash = Buffer.isBuffer(storedPassword)
                            ? storedPassword.toString('utf8')
                            : storedPassword;

                        try {
                            const match = await bcrypt.compare(password, hash);
                            if (!match) {
                                console.error(
                                    'LDAP Auth Error: Password mismatch',
                                );
                                client.unbind();
                                return resolve(null);
                            }
                        } catch (bcryptErr) {
                            
                            
                            console.warn(
                                'LDAP Auth Warning: Bcrypt compare failed, trying simple bind...',
                                bcryptErr.message,
                            );

                            return new Promise((resolveBind, rejectBind) => {
                                client.bind(userDN, password, (err) => {
                                    if (err) {
                                        console.error(
                                            'LDAP User Bind Error:',
                                            err.message,
                                        );
                                        client.unbind();
                                        return resolve(null);
                                    }
                                    
                                    checkGroups(
                                        client,
                                        userDN,
                                        username,
                                        email,
                                        resolve,
                                        reject,
                                    );
                                });
                            });
                        }

                        
                        checkGroups(
                            client,
                            userDN,
                            username,
                            email,
                            resolve,
                            reject,
                        );
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

    
    createUser: (username, email, password, isAdmin = false) => {
        return new Promise(async (resolve, reject) => {
            const client = createClient();

            const ADMIN_DN = process.env.LDAP_ADMIN_DN;
            const ADMIN_PASSWORD = process.env.LDAP_ADMIN_PASSWORD;

            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            client.bind(ADMIN_DN, ADMIN_PASSWORD, (err) => {
                if (err) {
                    console.error('LDAP Admin Bind Error:', err);
                    client.unbind();
                    return reject(new Error('Failed to bind to LDAP as admin'));
                }

                const userDN = `cn=${username},${USERS_DN}`;

                const entry = {
                    cn: username,
                    sn: username, 
                    mail: email,
                    objectClass: ['inetOrgPerson', 'top'],
                    userPassword: hashedPassword,
                };

                client.add(userDN, entry, (err) => {
                    if (err) {
                        console.error('LDAP Add User Error:', err);
                        client.unbind();
                        return reject(err);
                    }

                    
                    const addToNormals = new Promise((resolve, reject) => {
                        const change = new ldap.Change({
                            operation: 'add',
                            modification: {
                                type: 'uniqueMember',
                                values: [userDN],
                            },
                        });
                        client.modify(NORMALS_GROUP_DN, change, (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });

                    
                    const addToAdmins = isAdmin
                        ? new Promise((resolve, reject) => {
                              const change = new ldap.Change({
                                  operation: 'add',
                                  modification: {
                                      type: 'uniqueMember',
                                      values: [userDN],
                                  },
                              });
                              client.modify(ADMINS_GROUP_DN, change, (err) => {
                                  if (err) reject(err);
                                  else resolve();
                              });
                          })
                        : Promise.resolve();

                    Promise.all([addToNormals, addToAdmins])
                        .then(() => {
                            client.unbind();
                            resolve({ username, email });
                        })
                        .catch((err) => {
                            client.unbind();
                            console.error('LDAP Group Add Error:', err);
                            
                            resolve({
                                username,
                                email,
                                warning:
                                    'User created but failed to add to groups',
                            });
                        });
                });
            });
        });
    },

    
    userExists: (username) => {
        return new Promise((resolve, reject) => {
            const client = createClient();
            const opts = {
                filter: `(cn=${username})`,
                scope: 'sub',
                attributes: ['cn'],
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
    },

    
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            const client = createClient();

            const ADMIN_DN = process.env.LDAP_ADMIN_DN;
            const ADMIN_PASSWORD = process.env.LDAP_ADMIN_PASSWORD;

            client.bind(ADMIN_DN, ADMIN_PASSWORD, (err) => {
                if (err) {
                    console.error('LDAP Admin Bind Error:', err);
                    client.unbind();
                    return reject(err);
                }

                const searchOpts = {
                    filter: '(objectClass=inetOrgPerson)',
                    scope: 'sub',
                    attributes: ['cn', 'mail'],
                };

                client.search(USERS_DN, searchOpts, (err, res) => {
                    if (err) {
                        client.unbind();
                        return reject(err);
                    }

                    const users = [];
                    res.on('searchEntry', (entry) => {
                        const cnAttr = entry.attributes.find(
                            (a) => a.type === 'cn',
                        );
                        const mailAttr = entry.attributes.find(
                            (a) => a.type === 'mail',
                        );
                        const cn = cnAttr?.values[0];
                        const mail = mailAttr?.values[0];
                        if (cn && mail) {
                            users.push({
                                username: cn,
                                email: mail,
                                id: cn,
                                createdAt: null,
                            });
                        }
                    });

                    res.on('end', () => {
                        
                        const promises = users.map((user) => {
                            return new Promise((resolve) => {
                                const groupOpts = {
                                    filter: `(uniqueMember=cn=${user.username},${USERS_DN})`,
                                    scope: 'sub',
                                    attributes: ['cn'],
                                };

                                client.search(
                                    GROUPS_DN,
                                    groupOpts,
                                    (err, res) => {
                                        if (err) {
                                            resolve({
                                                ...user,
                                                isAdmin: false,
                                            });
                                            return;
                                        }

                                        let isAdmin = false;
                                        res.on('searchEntry', (entry) => {
                                            const cnAttr =
                                                entry.attributes.find(
                                                    (a) => a.type === 'cn',
                                                );
                                            const cn = cnAttr?.values[0];
                                            if (cn === 'admins') isAdmin = true;
                                        });

                                        res.on('end', () => {
                                            resolve({
                                                ...user,
                                                is_admin: isAdmin,
                                            });
                                        });

                                        res.on('error', () => {
                                            resolve({
                                                ...user,
                                                is_admin: false,
                                            });
                                        });
                                    },
                                );
                            });
                        });

                        Promise.all(promises).then((usersWithAdmin) => {
                            client.unbind();
                            resolve(usersWithAdmin);
                        });
                    });

                    res.on('error', (err) => {
                        client.unbind();
                        reject(err);
                    });
                });
            });
        });
    },

    
    updateUser: (username, { email, password, is_admin }) => {
        return new Promise(async (resolve, reject) => {
            const client = createClient();

            const ADMIN_DN = process.env.LDAP_ADMIN_DN;
            const ADMIN_PASSWORD = process.env.LDAP_ADMIN_PASSWORD;

            
            let hashedPassword = null;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(password, salt);
            }

            client.bind(ADMIN_DN, ADMIN_PASSWORD, (err) => {
                if (err) {
                    console.error('LDAP Admin Bind Error:', err);
                    client.unbind();
                    return reject(err);
                }

                const userDN = `cn=${username},${USERS_DN}`;
                const modifications = [];

                
                if (email) {
                    modifications.push(
                        new ldap.Change({
                            operation: 'replace',
                            modification: {
                                type: 'mail',
                                values: [email],
                            },
                        }),
                    );
                }

                
                if (hashedPassword) {
                    modifications.push(
                        new ldap.Change({
                            operation: 'replace',
                            modification: {
                                type: 'userPassword',
                                values: [hashedPassword],
                            },
                        }),
                    );
                }

                
                const applyUserChanges = () => {
                    if (modifications.length === 0) return Promise.resolve();

                    
                    
                    
                    
                    

                    return new Promise((resolve, reject) => {
                        client.modify(userDN, modifications, (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                };

                
                const updateAdminGroup = () => {
                    if (is_admin === undefined) return Promise.resolve();

                    return new Promise((resolve, reject) => {
                        
                        const groupOpts = {
                            filter: `(uniqueMember=${userDN})`,
                            scope: 'sub',
                            attributes: ['cn'],
                        };

                        client.search(
                            ADMINS_GROUP_DN,
                            groupOpts,
                            (err, res) => {
                                if (err) return reject(err);

                                let isCurrentlyAdmin = false;
                                res.on('searchEntry', (entry) => {
                                    isCurrentlyAdmin = true;
                                });

                                res.on('end', () => {
                                    if (is_admin && !isCurrentlyAdmin) {
                                        
                                        const change = new ldap.Change({
                                            operation: 'add',
                                            modification: {
                                                type: 'uniqueMember',
                                                values: [userDN],
                                            },
                                        });
                                        client.modify(
                                            ADMINS_GROUP_DN,
                                            change,
                                            (err) => {
                                                if (err) reject(err);
                                                else resolve();
                                            },
                                        );
                                    } else if (!is_admin && isCurrentlyAdmin) {
                                        
                                        const change = new ldap.Change({
                                            operation: 'delete',
                                            modification: {
                                                type: 'uniqueMember',
                                                values: [userDN],
                                            },
                                        });
                                        client.modify(
                                            ADMINS_GROUP_DN,
                                            change,
                                            (err) => {
                                                if (err) reject(err);
                                                else resolve();
                                            },
                                        );
                                    } else {
                                        resolve();
                                    }
                                });

                                res.on('error', (err) => reject(err));
                            },
                        );
                    });
                };

                Promise.all([applyUserChanges(), updateAdminGroup()])
                    .then(() => {
                        client.unbind();
                        resolve({ username });
                    })
                    .catch((err) => {
                        client.unbind();
                        reject(err);
                    });
            });
        });
    },

    
    deleteUser: (username) => {
        return new Promise((resolve, reject) => {
            const client = createClient();

            const ADMIN_DN = process.env.LDAP_ADMIN_DN;
            const ADMIN_PASSWORD = process.env.LDAP_ADMIN_PASSWORD;

            client.bind(ADMIN_DN, ADMIN_PASSWORD, (err) => {
                if (err) {
                    console.error('LDAP Admin Bind Error:', err);
                    client.unbind();
                    return reject(err);
                }

                const userDN = `cn=${username},${USERS_DN}`;

                
                const groupOpts = {
                    filter: `(uniqueMember=${userDN})`,
                    scope: 'sub',
                    attributes: ['dn'],
                };

                client.search(GROUPS_DN, groupOpts, (err, res) => {
                    if (err) {
                        client.unbind();
                        return reject(err);
                    }

                    const changes = [];
                    res.on('searchEntry', (entry) => {
                        const groupDN = entry.objectName.toString();
                        changes.push({
                            dn: groupDN,
                            change: new ldap.Change({
                                operation: 'delete',
                                modification: {
                                    type: 'uniqueMember',
                                    values: [userDN],
                                },
                            }),
                        });
                    });

                    res.on('end', () => {
                        
                        const promises = changes.map(({ dn, change }) => {
                            return new Promise((resolve, reject) => {
                                client.modify(dn, change, (err) => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            });
                        });

                        Promise.all(promises)
                            .then(() => {
                                
                                client.del(userDN, (err) => {
                                    client.unbind();
                                    if (err) reject(err);
                                    else resolve();
                                });
                            })
                            .catch(reject);
                    });

                    res.on('error', (err) => {
                        client.unbind();
                        reject(err);
                    });
                });
            });
        });
    },
};
