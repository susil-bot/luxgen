#!/usr/bin/env node

/**
 * Strict File Naming Convention Validator
 * Ensures all files follow the established naming patterns
 */

const fs = require('fs');
const path = require('path');

// Naming patterns
const PATTERNS = {
  // React components should be PascalCase
  COMPONENT: /^[A-Z][a-zA-Z0-9]*\.tsx?$/,
  // Utility files should be camelCase
  UTILITY: /^[a-z][a-zA-Z0-9]*\.ts?$/,
  // Constants should be UPPER_CASE
  CONSTANT: /^[A-Z][A-Z0-9_]*\.ts?$/,
  // Test files should be PascalCase.spec.tsx
  TEST: /^[A-Z][a-zA-Z0-9]*\.spec\.tsx?$/,
  // Type files should be PascalCase.types.ts
  TYPE: /^[A-Z][a-zA-Z0-9]*\.types\.ts$/,
  // Hook files should be useHookName.ts
  HOOK: /^use[A-Z][a-zA-Z0-9]*\.ts$/,
  // Service files should be camelCase
  SERVICE: /^[a-z][a-zA-Z0-9]*Service\.ts$/,
  // Index files are allowed
  INDEX: /^index\.tsx?$/
};

// Directory patterns
const DIRECTORY_PATTERNS = {
  // Directories should be kebab-case
  KEBAB_CASE: /^[a-z][a-z0-9-]*$/
};

// File type mappings
const FILE_TYPE_MAPPINGS = {
  'components/': 'COMPONENT',
  'hooks/': 'HOOK',
  'services/': 'SERVICE',
  'utils/': 'UTILITY',
  'types/': 'TYPE',
  'constants/': 'CONSTANT',
  'tests/': 'TEST',
  '__tests__/': 'TEST'
};

// Validation results
const results = {
  valid: [],
  invalid: [],
  warnings: []
};

/**
 * Check if a filename matches the expected pattern
 */
function validateFileName(filePath, expectedType) {
  const fileName = path.basename(filePath);
  const pattern = PATTERNS[expectedType];
  
  if (!pattern) {
    results.warnings.push(`Unknown file type for: ${filePath}`);
    return true;
  }
  
  if (pattern.test(fileName)) {
    results.valid.push(filePath);
    return true;
  } else {
    results.invalid.push({
      file: filePath,
      expected: expectedType,
      pattern: pattern.toString(),
      actual: fileName
    });
    return false;
  }
}

/**
 * Check if a directory name follows kebab-case
 */
function validateDirectoryName(dirPath) {
  const dirName = path.basename(dirPath);
  
  if (DIRECTORY_PATTERNS.KEBAB_CASE.test(dirName)) {
    results.valid.push(dirPath);
    return true;
  } else {
    results.invalid.push({
      file: dirPath,
      expected: 'KEBAB_CASE',
      pattern: DIRECTORY_PATTERNS.KEBAB_CASE.toString(),
      actual: dirName
    });
    return false;
  }
}

/**
 * Determine file type based on directory structure and file name
 */
function getExpectedFileType(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  const fileName = path.basename(filePath);
  
  // Handle test files
  if (fileName.includes('.spec.')) {
    return 'TEST';
  }
  
  // Handle type files
  if (fileName.endsWith('.types.ts')) {
    return 'TYPE';
  }
  
  // Handle constants
  if (fileName === 'CONSTANTS.ts' || fileName === 'constants.ts') {
    return 'CONSTANT';
  }
  
  // Handle index files
  if (fileName === 'index.ts' || fileName === 'index.tsx') {
    return 'INDEX';
  }
  
  // Handle README files
  if (fileName === 'README.md') {
    return null; // Skip README files
  }
  
  // Handle utility files in specific directories
  if (relativePath.includes('/helpers/') || 
      relativePath.includes('/fetchers/') || 
      relativePath.includes('/transformers/') ||
      fileName.includes('Helper') ||
      fileName.includes('Fetcher') ||
      fileName.includes('Transformer')) {
    return 'UTILITY';
  }
  
  // Handle service files
  if (fileName.includes('Service')) {
    return 'SERVICE';
  }
  
  // Handle hook files
  if (fileName.startsWith('use')) {
    return 'HOOK';
  }
  
  // Handle queries, fetcher, transformer files
  if (['queries.ts', 'fetcher.ts', 'transformer.ts', 'fixture.ts', 'fixture.js'].includes(fileName)) {
    return 'UTILITY';
  }
  
  // Check for specific directory patterns
  for (const [dirPattern, fileType] of Object.entries(FILE_TYPE_MAPPINGS)) {
    if (relativePath.includes(dirPattern)) {
      return fileType;
    }
  }
  
  // Default to component for .tsx files
  if (filePath.endsWith('.tsx')) {
    return 'COMPONENT';
  }
  
  // Default to utility for .ts files
  if (filePath.endsWith('.ts')) {
    return 'UTILITY';
  }
  
  return null;
}

/**
 * Recursively scan directory for files
 */
function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Validate directory name
        validateDirectoryName(fullPath);
        // Recursively scan subdirectory
        scanDirectory(fullPath);
      } else if (stat.isFile()) {
        // Validate file name
        const expectedType = getExpectedFileType(fullPath);
        if (expectedType) {
          validateFileName(fullPath, expectedType);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
}

/**
 * Generate report
 */
function generateReport() {
  console.log('\n📝 STRICT FILE NAMING CONVENTION VALIDATION REPORT\n');
  console.log('=' .repeat(60));
  
  // Valid files
  if (results.valid.length > 0) {
    console.log(`\n✅ VALID FILES (${results.valid.length}):`);
    results.valid.forEach(file => {
      console.log(`   ✓ ${file}`);
    });
  }
  
  // Invalid files
  if (results.invalid.length > 0) {
    console.log(`\n❌ INVALID FILES (${results.invalid.length}):`);
    results.invalid.forEach(item => {
      console.log(`   ✗ ${item.file}`);
      console.log(`     Expected: ${item.expected}`);
      console.log(`     Pattern:  ${item.pattern}`);
      console.log(`     Actual:   ${item.actual}`);
      console.log('');
    });
  }
  
  // Warnings
  if (results.warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${results.warnings.length}):`);
    results.warnings.forEach(warning => {
      console.log(`   ⚠ ${warning}`);
    });
  }
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log(`📊 SUMMARY:`);
  console.log(`   Valid:   ${results.valid.length}`);
  console.log(`   Invalid: ${results.invalid.length}`);
  console.log(`   Warnings: ${results.warnings.length}`);
  
  if (results.invalid.length > 0) {
    console.log(`\n🚨 NAMING CONVENTION VIOLATIONS FOUND!`);
    console.log(`   Please rename files to follow strict naming conventions.`);
    console.log(`   See NAMING_CONVENTIONS.md for details.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 ALL FILES FOLLOW NAMING CONVENTIONS!`);
    process.exit(0);
  }
}

/**
 * Main execution
 */
function main() {
  const targetDir = process.argv[2] || './src';
  
  console.log(`🔍 Scanning directory: ${targetDir}`);
  console.log(`📋 Validating file naming conventions...\n`);
  
  scanDirectory(targetDir);
  generateReport();
}

// Run the validator
if (require.main === module) {
  main();
}

module.exports = {
  validateFileName,
  validateDirectoryName,
  scanDirectory,
  PATTERNS,
  DIRECTORY_PATTERNS
};
