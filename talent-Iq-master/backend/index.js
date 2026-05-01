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

import http from "http";
import { WebSocketServer } from "ws";
import yUtils from "y-websocket/bin/utils";

const { setupWSConnection } = yUtils;

connectDB()
.then(()=>{
    const server = http.createServer(app);
    
    // Set up WebSocket server for Yjs
    const wss = new WebSocketServer({ server });
    wss.on("connection", (conn, req) => {
      // Setup Yjs connection
      // We can use req.url to separate rooms if needed
      setupWSConnection(conn, req, { gc: true });
    });

    server.listen(PORT,()=>{
    console.log (` ⚙️ SERVER IS RUNNING ON PORT => ${PORT}`)
  })
})
.catch((err)=>{
  console.log("Mongodb connection error",err)
})
