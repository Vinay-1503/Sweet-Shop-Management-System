#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const buildType = args[0] || 'web';

console.log(`🚀 Building Nataraja Traders for: ${buildType.toUpperCase()}`);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step) {
  log(`\n${colors.cyan}▶ ${step}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Check if required dependencies are installed
function checkDependencies() {
  logStep('Checking dependencies...');
  
  try {
    // Check if package.json exists
    if (!fs.existsSync('package.json')) {
      throw new Error('package.json not found. Please run this script from the project root.');
    }
    
    // Check if node_modules exists
    if (!fs.existsSync('node_modules')) {
      logWarning('node_modules not found. Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
    }
    
    logSuccess('Dependencies check passed');
  } catch (error) {
    logError(`Dependencies check failed: ${error.message}`);
    process.exit(1);
  }
}

// Build the React application
function buildReactApp() {
  logStep('Building React application...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    logSuccess('React application built successfully');
  } catch (error) {
    logError('React build failed');
    process.exit(1);
  }
}

// Build for mobile (Capacitor)
function buildMobile() {
  logStep('Building for mobile (Capacitor)...');
  
  try {
    // Check if Capacitor is installed
    if (!fs.existsSync('android')) {
      logInfo('Android platform not found. Adding Android platform...');
      execSync('npx cap add android', { stdio: 'inherit' });
    }
    
    // Sync with Capacitor
    logInfo('Syncing with Capacitor...');
    execSync('npx cap sync android', { stdio: 'inherit' });
    
    // Copy web assets
    logInfo('Copying web assets...');
    execSync('npx cap copy android', { stdio: 'inherit' });
    
    logSuccess('Mobile build completed successfully');
    logInfo('To build APK:');
    logInfo('1. Run: npx cap open android');
    logInfo('2. In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)');
    logInfo('3. Or use command line: cd android && ./gradlew assembleDebug');
    
  } catch (error) {
    logError(`Mobile build failed: ${error.message}`);
    process.exit(1);
  }
}

// Build for web
function buildWeb() {
  logStep('Building for web...');
  
  try {
    // The React build is already done, just verify
    if (fs.existsSync('dist')) {
      logSuccess('Web build completed successfully');
      logInfo('Web build is ready in the "dist" folder');
      logInfo('To preview: npm run preview');
      logInfo('To deploy: Upload the "dist" folder to your hosting service');
    } else {
      throw new Error('dist folder not found after build');
    }
  } catch (error) {
    logError(`Web build failed: ${error.message}`);
    process.exit(1);
  }
}

// Build for both platforms
function buildBoth() {
  logStep('Building for both platforms...');
  
  try {
    buildReactApp();
    buildWeb();
    buildMobile();
    
    logSuccess('Build completed for both platforms!');
    logInfo('\n📱 Mobile: Android project ready in "android" folder');
    logInfo('🌐 Web: Production build ready in "dist" folder');
    
  } catch (error) {
    logError(`Build failed: ${error.message}`);
    process.exit(1);
  }
}

// Main build function
function main() {
  try {
    log(`${colors.bright}${colors.cyan}Nataraja Traders - Build Script${colors.reset}\n`);
    
    // Check dependencies first
    checkDependencies();
    
    // Build based on type
    switch (buildType.toLowerCase()) {
      case 'mobile':
        buildReactApp();
        buildMobile();
        break;
      case 'web':
        buildReactApp();
        buildWeb();
        break;
      case 'both':
        buildBoth();
        break;
      default:
        logError(`Invalid build type: ${buildType}`);
        logInfo('Valid options: web, mobile, both');
        process.exit(1);
    }
    
    log(`\n${colors.green}🎉 Build completed successfully!${colors.reset}`);
    
  } catch (error) {
    logError(`Build failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the build
main(); 