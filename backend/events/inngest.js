// STEP: 1. Import Inngest, connectDB, and User model and others
import { Inngest } from "inngest";
import connectDB from "../db/db.js";
import { User } from "../models/user.model.js";
import logger from "../utils/logger.js";
import { upsertStreamUser, deleteStreamUser } from "./stream.js";
// STEP: 2. Initialize  and export Inngest with the the event id
export const inngest = new Inngest({ id: "talent-iq" });

// STEP: 3. write your event handler function

//?  sync-user function to create user in DB when clerk/user.created event is received
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, profile_image_url } = event.data;

    // create a new user in the database
    const newUser = {
      clerkId: id,
      email: email_addresses[0].email_address, // taking the primary email address
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      profileImage: profile_image_url,
    };

    logger.info("User synced from Clerk", { clerkId: id });
    // save the new user to the database
    await User.findOneAndUpdate({ clerkId: id }, newUser, { upsert: true, new: true });

    //? Stream upsert user
    await upsertStreamUser({
      id: id, // Stream user ID should match Clerk user ID
      name: newUser.name,
      email: newUser.email,
      image: newUser.profileImage,
    });
  }
);

//? delete-user function to delete user from DB when clerk/user.deleted event is received
const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;

    logger.info("User deleted from DB", { clerkId: id });
    // delete the user from the database
    await User.deleteOne({ clerkId: id });

    //? Stream delete user
    await deleteStreamUser(id);
  }
);

// STEP: 4. Export the event handler function

export const functions = [syncUser, deleteUserFromDB];

//NOTE:  newUser --> what is this ? --> it's the user object we created above in line 18 where we have name email profileImage etc we destructured from event.data then stored in newUser object

/* NOTE: we have update our code from     
await User.create(newUser); 
    to 
await User.findOneAndUpdate(
  { clerkId: id },
  newUser,
  { upsert: true, new: true }
);

because 

create() -->Always tries to insert a new document

our system is system is event-driven
Clerk can retry webhooks
Inngest retries on failure
Network can glitch
Render can restart mid-job
If the same event runs twice:
Second run → duplicate key error
Function crashes
Stream sync may never happen
DB & Stream go out of sync

findOneAndUpdate(..., { upsert: true }) --> running it once or 10 times gives the same final result

“Find a user with this clerkId
If found → update it
If NOT found → create it”

“If we sign up, how will it create?”
It WILL create, because of upsert: true.
*/
