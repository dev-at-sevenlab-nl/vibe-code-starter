#!/usr/bin/env node

// This script checks if the current Node.js version meets the minimum requirements
// It runs before any npm commands to ensure compatibility

const MIN_NODE_VERSION = 20;

function checkNodeVersion() {
    const currentVersion = process.versions.node;
    const majorVersion = parseInt(currentVersion.split('.')[0], 10);
    
    if (majorVersion < MIN_NODE_VERSION) {
        console.error('\x1b[31mError: Node.js version', currentVersion, 'is not supported\x1b[0m');
        console.error('\x1b[33mThis tool requires Node.js version', MIN_NODE_VERSION, 'or higher\x1b[0m');
        console.error('\x1b[33mPlease upgrade your Node.js version and try again\x1b[0m');
        console.error('\x1b[33mYou can use nvm to manage Node.js versions: https://github.com/nvm-sh/nvm\x1b[0m');
        
        // Exit with error code
        process.exit(1);
    }
    
    console.log('\x1b[32mNode.js version check passed ✓\x1b[0m');
}

// Run the check
checkNodeVersion(); 