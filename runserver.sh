#!/bin/bash

# Set the application path
APP_PATH="/opt/magyapp"

if [ ! -d "$APP_PATH" ]; then
    mkdir -p "$APP_PATH"
fi

# Create the log folder if it doesn't exist
LOG_FOLDER="/var/log/magyapp"

# Create the log folder if it doesn't exist
if [ ! -d "$LOG_FOLDER" ]; then
    mkdir -p "$LOG_FOLDER"
fi

# Start the backend server and redirect the logs to the log folder
cd "$APP_PATH/backend"
node server.js >> "$LOG_FOLDER/backend.log" 2>&1 &

# Start the frontend server and redirect the logs to the log folder
cd "$APP_PATH/frontend"
node server.js >> "$LOG_FOLDER/frontend.log" 2>&1 &

# Install logrotate if not installed
if ! command -v logrotate &> /dev/null; then
    sudo apt-get install logrotate -y
fi

# Create logrotate configuration for backend logs
sudo tee /etc/logrotate.d/backend <<EOF
$APP_PATH/backend.log {
    daily
    rotate 30
    compress
    missingok
    notifempty
}
EOF

# Create logrotate configuration for frontend logs
sudo tee /etc/logrotate.d/frontend <<EOF
$APP_PATH/frontend.log {
    daily
    rotate 30
    compress
    missingok
    notifempty
}
EOF