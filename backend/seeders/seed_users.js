import sequelize from '../controllers/dbController.js';
import User from '../models/user.js';

async function seed() {
    console.log('Starting User seeder...');

    await sequelize.sync();

    const users = [
        {
            email: 'admin@canaryweather.com',
            username: 'admin',
            password: 'password123',
            is_admin: true,
        },
        {
            email: 'user1@example.com',
            username: 'user1',
            password: 'password123',
            is_admin: false,
        },
        {
            email: 'user2@example.com',
            username: 'user2',
            password: 'password123',
            is_admin: false,
        },
        {
            email: 'testuser@canaryweather.com',
            username: 'testuser',
            password: 'test123',
            is_admin: false,
        },
        {
            email: 'demo@canaryweather.com',
            username: 'demo',
            password: 'demo123',
            is_admin: false,
        },
    ];

    for (const userData of users) {
        try {
            // Remove password from userData for DB insertion
            const { password, ...userDataForDb } = userData;

            const [user, created] = await User.findOrCreate({
                where: { email: userData.email },
                defaults: userDataForDb,
            });

            if (created) {
                console.log(`Created user: ${user.username} (${user.email})`);
            } else {
                console.log(
                    `User already exists: ${user.username} (${user.email})`,
                );
            }
        } catch (error) {
            console.error(
                `Error creating user ${userData.email}:`,
                error.message,
            );
        }
    }

    console.log('User seeding completed!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
