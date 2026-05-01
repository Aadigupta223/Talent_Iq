import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const mongoBase = process.env.MONGODB_URI || "mongodb://localhost:27017";
        const connectionString = `${mongoBase.replace(/\/+$/, "")}/${DB_NAME}`;

        const connectionInstance = await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        console.log(
            "Hint: set MONGODB_URI in .env to a valid Mongo connection string, e.g. mongodb://localhost:27017 or mongodb+srv://user:pass@cluster0.xyz.mongodb.net"
        );
        process.exit(1);
    }
}

export default connectDB