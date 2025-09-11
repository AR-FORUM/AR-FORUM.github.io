#!/bin/bash

# Blog build script - syncs main site assets and builds Jekyll

echo "Building blog..."

# Create sync directories if they don't exist
mkdir -p assets/scripts_sync
mkdir -p assets/styles_sync

# Sync scripts from parent directory
echo "Syncing scripts..."
cp ../scripts/*.js assets/scripts_sync/

# Sync styles from parent directory
echo "Syncing styles..."
cp ../styles/*.css assets/styles_sync/

# Copy and update header.html to work with blog paths
echo "Syncing header..."
cp ../header.html assets/scripts_sync/header.html

# Build Jekyll
echo "Building Jekyll site..."
jekyll build

echo "Blog build complete!"
echo "Output in: ../blog/"