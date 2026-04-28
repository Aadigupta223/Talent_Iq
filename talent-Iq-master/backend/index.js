import dotenv from "dotenv"
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import connectDB from "./db/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"), // load repo root .env reliably
  quiet: true,
})
const PORT = process.env.PORT || 8000
console.log("Serving from:", process.env.BASE_URL);
console.log("CORS ORIGIN is:", process.env.CORS_ORIGIN);

connectDB()
.then(()=>{
    app.listen(PORT,()=>{
    console.log (` ⚙️ SERVER IS RUNNING ON PORT => ${PORT}`)
  })
})
.catch((err)=>{
  console.log("Mongodb connection error",err)
})
