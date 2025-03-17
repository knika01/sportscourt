#!/bin/bash

echo "Starting setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js not found. Please install it from https://nodejs.org/"
    exit 1
fi

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Install Express.js explicitly
echo "Installing Express.js..."
npm install express

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null
then
    echo "❌ PostgreSQL not found. Please install it."
    exit 1
fi

# Create a .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat <<EOL > .env
PG_USER=neondb_owner
PG_PASSWORD=npg_AGUYr5OM9aZJ
PG_HOST=ep-delicate-sunset-a5n3hmlq-pooler.us-east-2.aws.neon.tech
PG_PORT=5432
PG_DB=neondb
PORT=5001
EOL
    echo "⚠️ Update the .env file with correct Neon credentials."
fi

echo "Setup complete! Run 'npm start' to launch the backend."
