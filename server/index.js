// Local development server. On Vercel the same app runs as a function from api/index.js.
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
