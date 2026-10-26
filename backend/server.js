'use strict';

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n🚀  Nellai Mart API running on port ${PORT}`);
    console.log(`📦  Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗  Health      : http://localhost:${PORT}/api/v1/health\n`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    server.close(() => process.exit(1));
  });
}

startServer();
