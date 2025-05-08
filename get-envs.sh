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

# Get the API_URL value from Doppler
API_URL="$(doppler secrets get API_URL --plain --config "$CONFIG")"
echo "API_URL: $API_URL"

# Get the DOPPLER_CONFIG value from Doppler
DOPPLER_CONFIG="$(doppler secrets get DOPPLER_CONFIG --plain --config "$CONFIG")"
echo "DOPPLER_CONFIG: $DOPPLER_CONFIG"
