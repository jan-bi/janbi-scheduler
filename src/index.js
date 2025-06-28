import "dotenv/config.js";
import connectDatabase from "./config/database.js";
import { initializeSchedule } from "./scheduler/scheduler.js";

(async () => {
  await connectDatabase();
  await initializeSchedule();
})();
