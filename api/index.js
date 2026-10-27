// Vercel serverless entry: every /api/* request is routed here (see vercel.json) and handled
// by the same Express app the local server uses.
import app from '../server/app.js';
import { connectDB, dbState } from '../server/config/db.js';

// Connect once per warm function instance; if the database was unreachable, try again on
// the next request instead of staying in mock-data mode for the life of the instance.
let connecting = null;

export default async function handler(req, res) {
  if (!dbState.connected) {
    connecting ||= connectDB().finally(() => { connecting = null; });
    await connecting;
  }
  return app(req, res);
}
