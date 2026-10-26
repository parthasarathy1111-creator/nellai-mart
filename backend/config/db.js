'use strict';

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS servers to prevent Windows querySrv ECONNREFUSED issues for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if DNS override fails
}

let isConnected = false;
let mongoMemoryServer = null;

async function connectDB() {
  if (isConnected) return;

  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!rawUri) {
    console.warn('⚠️  MONGODB_URI not found in env. Falling back to MongoDB Memory Server.');
  } else {
    // List candidate URIs to handle unencoded <password> placeholders or special characters gracefully
    const candidateUris = [rawUri];
    if (rawUri.includes('<') || rawUri.includes('>')) {
      candidateUris.push(rawUri.replace('<', '%3C').replace('>', '%3E'));
      candidateUris.push(rawUri.replace(/<([^>]+)>/g, '$1'));
    }

    for (const uri of candidateUris) {
      try {
        console.log('🔄 Connecting to MongoDB Atlas / Database...');
        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        });

        isConnected = true;
        console.log(`✅  MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);

        mongoose.connection.on('disconnected', () => {
          isConnected = false;
          console.warn('⚠️   MongoDB disconnected.');
        });

        mongoose.connection.on('error', (err) => {
          console.error('MongoDB connection error:', err.message);
        });

        return;
      } catch (err) {
        console.warn(`⚠️  Failed to connect to URI (${err.message}). Trying next option...`);
      }
    }
  }

  // Fallback to MongoMemoryServer with persistent dbPath if remote/local Mongo connection fails
  try {
    console.log('📦 Starting embedded MongoDB Server (Persistent Fallback)...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const dbDir = path.resolve(__dirname, '../.dbdata');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        dbPath: dbDir,
        storageEngine: 'wiredTiger',
      },
    });
    const memoryUri = mongoMemoryServer.getUri();

    const conn = await mongoose.connect(memoryUri);
    isConnected = true;
    console.log(`✅  Connected to Local Persistent MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌  Fatal: All MongoDB connection attempts failed:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
