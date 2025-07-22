#!/bin/bash

# Logger function
source "./logger.sh"

# Check if config is provided
if [ $# -eq 0 ]; then
    log "ERROR" "Config is not set. Usage: $0 <config> [options]"
    exit 1
fi

# Set config
CONFIG="$1"

# Get the APP_API_BASE_URL value from Doppler
APP_API_BASE_URL="$(doppler secrets get APP_API_BASE_URL --plain --config "$CONFIG")"
echo "APP_API_BASE_URL: $APP_API_BASE_URL"

# Get the DOPPLER_CONFIG value from Doppler
DOPPLER_CONFIG="$(doppler secrets get DOPPLER_CONFIG --plain --config "$CONFIG")"
echo "DOPPLER_CONFIG: $DOPPLER_CONFIG"
