#!/usr/bin/env node

// Environment Check Script
console.log('🔍 Checking environment configuration...\n');

// Check if we're in a React environment
console.log('📦 React Environment:');
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`  REACT_APP_API_BASE_URL: ${process.env.REACT_APP_API_BASE_URL || 'not set'}`);
console.log(`  REACT_APP_API_URL: ${process.env.REACT_APP_API_URL || 'not set'}`);

// Check if .env file exists
const fs = require('fs');
const path = require('path');

const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
console.log('\n📁 Environment Files:');
envFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`  ${file}: ${exists ? '✅ exists' : '❌ missing'}`);
});

// Check package.json
console.log('\n📋 Package.json:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`  Name: ${packageJson.name}`);
  console.log(`  Version: ${packageJson.version}`);
  console.log(`  React: ${packageJson.dependencies.react}`);
  console.log(`  React DOM: ${packageJson.dependencies['react-dom']}`);
  console.log(`  React Router: ${packageJson.dependencies['react-router-dom']}`);
} catch (error) {
  console.log('  ❌ Error reading package.json');
}

// Check TypeScript config
console.log('\n⚙️ TypeScript Configuration:');
try {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  console.log(`  Target: ${tsConfig.compilerOptions.target}`);
  console.log(`  JSX: ${tsConfig.compilerOptions.jsx}`);
  console.log(`  Strict: ${tsConfig.compilerOptions.strict}`);
} catch (error) {
  console.log('  ❌ Error reading tsconfig.json');
}

// Check Jest config
console.log('\n🧪 Jest Configuration:');
try {
  const jestConfig = require('./jest.config.js');
  console.log(`  Test Environment: ${jestConfig.testEnvironment}`);
  console.log(`  Test Match: ${jestConfig.testMatch.length} patterns`);
} catch (error) {
  console.log('  ❌ Error reading jest.config.js');
}

console.log('\n✅ Environment check complete!'); 