#!/bin/bash

# Load environment variables
source .env

# Run the schema file
PGPASSWORD=$PG_PASSWORD psql -h $PG_HOST -U $PG_USER -d $PG_DB -f schema.sql

echo "Database setup completed!" 