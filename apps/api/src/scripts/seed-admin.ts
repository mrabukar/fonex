import 'dotenv/config';
import { auth } from '../auth/auth';

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Admin';

  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in apps/api/.env before running this script.');
  }

  const result = await auth.api.createUser({
    body: { email, password, name, role: 'admin' },
  });

  console.log('Created admin user:', result.user.id, result.user.email);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => process.exit());
