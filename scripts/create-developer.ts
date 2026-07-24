import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClerkClient } from "@clerk/backend";
import { config } from "dotenv";

config({ path: ".env" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function main() {
  const email = "sree@gmail.com";
  const password = "Sreeram@007!";
  
  console.log("Checking if user already exists in Clerk...");
  let users = await clerk.users.getUserList({ emailAddress: [email] });
  let user = users.data[0];

  if (user) {
    console.log(`User already exists in Clerk with ID: ${user.id}. Updating password...`);
    user = await clerk.users.updateUser(user.id, { password });
  } else {
    console.log("Creating new user in Clerk...");
    user = await clerk.users.createUser({
      emailAddress: [email],
      password: password,
      firstName: "Sreeram",
      lastName: "Developer",
      skipPasswordChecks: true,
    });
    console.log(`User created in Clerk with ID: ${user.id}`);
  }

  console.log("Upserting profile and role in database...");
  await prisma.profile.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      full_name: "Sreeram Developer",
      badge: "developer",
      position: "Developer",
    },
    update: {
      badge: "developer",
    }
  });

  await prisma.userRole.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      user_id: user.id,
      role: "admin",
    },
    update: {
      role: "admin",
    }
  });

  console.log("Done! You can now log in with the new credentials.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
