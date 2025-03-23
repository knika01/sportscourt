#!/bin/bash

# Print colorful messages
print_message() {
    echo -e "\033[1;34m$1\033[0m"
}

print_error() {
    echo -e "\033[1;31m$1\033[0m"
}

print_success() {
    echo -e "\033[1;32m$1\033[0m"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    print_message "You can download it from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if Expo CLI is installed globally
if ! command -v expo &> /dev/null; then
    print_message "Installing Expo CLI globally..."
    npm install -g expo-cli
fi

# Navigate to the frontend directory
cd "$(dirname "$0")"

# Install dependencies
print_message "Installing project dependencies..."
npm install

# Install pods for iOS (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_message "Installing iOS dependencies..."
    cd ios
    pod install
    cd ..
fi

# Create necessary directories if they don't exist
mkdir -p .expo
mkdir -p assets/fonts

# Check if the SpaceMono font exists
if [ ! -f "assets/fonts/SpaceMono-Regular.ttf" ]; then
    print_message "Downloading SpaceMono font..."
    mkdir -p assets/fonts
    curl -o assets/fonts/SpaceMono-Regular.ttf https://github.com/google/fonts/raw/main/ofl/spacemono/SpaceMono-Regular.ttf
fi

print_success "Setup completed successfully!"
print_message "To start the development server, run:"
print_message "npx expo start"
print_message "To run the iOS simulator, run:"
print_message "Additional commands:"
print_message "- npm run ios     (for iOS simulator)"
print_message "- npm run android (for Android emulator)"
print_message "- npm run web     (for web browser)" 