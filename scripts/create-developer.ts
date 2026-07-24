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
  const oldEmail = "sree@gmail.com";
  const newEmail = "sreeram02420@gmail.com";
  const password = "Sreeram@007!";
  
  console.log(`Checking for old user ${oldEmail}...`);
  let oldUsers = await clerk.users.getUserList({ emailAddress: [oldEmail] });
  if (oldUsers.data.length > 0) {
    for (const u of oldUsers.data) {
      console.log(`Deleting old user from Clerk: ${u.id}`);
      await clerk.users.deleteUser(u.id);
      console.log(`Deleting old user from Database...`);
      await prisma.profile.deleteMany({ where: { id: u.id } });
      await prisma.userRole.deleteMany({ where: { id: u.id } });
    }
  } else {
    console.log(`Old user ${oldEmail} not found in Clerk.`);
  }

  console.log(`\nChecking if new user ${newEmail} already exists...`);
  let newUsers = await clerk.users.getUserList({ emailAddress: [newEmail] });
  let user = newUsers.data[0];

  if (user) {
    console.log(`User already exists in Clerk with ID: ${user.id}. Updating password...`);
    user = await clerk.users.updateUser(user.id, { password });
  } else {
    console.log("Creating new user in Clerk...");
    user = await clerk.users.createUser({
      emailAddress: [newEmail],
      password: password,
      firstName: "Sreeram",
      lastName: "Developer",
      skipPasswordChecks: true,
    });
    console.log(`User created in Clerk with ID: ${user.id}`);
  }

  console.log("Upserting profile and role in database for new user...");
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

  console.log("Done! You can now log in with sreeram02420@gmail.com.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
