import { db } from "@/db/database";
import { migrate } from "drizzle-orm/neon-http/migrator";

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "src/db/migrations",
    });
    console.log("Migration Completed");
  } catch (error) {
    console.log("Error during migration: ", error);
    process.exit(1);
  }
};

main();
