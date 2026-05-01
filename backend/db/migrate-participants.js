/**
 * Migration Script: Convert `participant` (singular) to `participants` (array)
 *
 * Run this ONCE after deploying the new session model:
 *   node backend/db/migrate-participants.js
 *
 * What it does:
 * 1. Finds all sessions that still have the old `participant` field
 * 2. Converts `participant` → `participants: [participant]` (or empty array if null)
 * 3. Sets `maxParticipants` to 100 for all sessions missing the field
 * 4. Removes the old `participant` field
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment variables");
  process.exit(1);
}

const DB_NAME = process.env.DB_NAME || "talentiq";
const connectionString = `${MONGODB_URI.replace(/\/+$/, "")}/${DB_NAME}`;

async function migrate() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(connectionString);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const sessionsCollection = db.collection("sessions");

    // Step 1: Find sessions with old `participant` field
    const sessionsWithOldField = await sessionsCollection
      .find({ participant: { $exists: true } })
      .toArray();

    console.log(
      `📊 Found ${sessionsWithOldField.length} sessions with old 'participant' field`
    );

    if (sessionsWithOldField.length === 0) {
      console.log("✅ No migration needed — all sessions already use the new schema.");
    } else {
      let migratedCount = 0;

      for (const session of sessionsWithOldField) {
        const participants = session.participant ? [session.participant] : [];

        await sessionsCollection.updateOne(
          { _id: session._id },
          {
            $set: {
              participants: participants,
              maxParticipants: session.maxParticipants || 100,
            },
            $unset: { participant: "" },
          }
        );

        migratedCount++;
      }

      console.log(`✅ Migrated ${migratedCount} sessions successfully`);
    }

    // Step 2: Ensure all sessions have maxParticipants
    const result = await sessionsCollection.updateMany(
      { maxParticipants: { $exists: false } },
      { $set: { maxParticipants: 100 } }
    );

    if (result.modifiedCount > 0) {
      console.log(
        `✅ Added maxParticipants to ${result.modifiedCount} sessions`
      );
    }

    console.log("🎉 Migration complete!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

migrate();
