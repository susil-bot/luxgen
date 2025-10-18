#!/usr/bin/env node

/**
 * Automatic File Naming Convention Fixer
 * Renames files to follow strict naming patterns
 */

const fs = require('fs');
const path = require('path');

// File type mappings for proper naming
const FILE_TYPE_MAPPINGS = {
  // Test files should be PascalCase.spec.tsx
  'spec.js': '.spec.tsx',
  'spec.ts': '.spec.tsx',
  'spec.tsx': '.spec.tsx',
  
  // Utility files should be camelCase
  'Helper.js': 'Helper.ts',
  'Helper.ts': 'Helper.ts',
  'Fetcher.js': 'Fetcher.ts',
  'Transformer.js': 'Transformer.ts',
  
  // Constants should be UPPER_CASE
  'constants.ts': 'CONSTANTS.ts',
  
  // Type files should be PascalCase.types.ts
  'types.ts': 'Types.types.ts',
  
  // Service files should be camelCase
  'Service.ts': 'Service.ts',
  
  // Index files are allowed as-is
  'index.ts': 'index.ts',
  'index.tsx': 'index.tsx'
};

// Directory mappings
const DIRECTORY_MAPPINGS = {
  '__tests__': 'tests'
};

/**
 * Get the correct file name based on file type and location
 */
function getCorrectFileName(filePath, fileName) {
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Handle test files
  if (fileName.includes('.spec.')) {
    const baseName = fileName.split('.spec.')[0];
    return `${baseName}.spec.tsx`;
  }
  
  // Handle utility files in specific directories
  if (relativePath.includes('/helpers/') || relativePath.includes('/fetchers/') || relativePath.includes('/transformers/')) {
    if (fileName.endsWith('.js')) {
      return fileName.replace('.js', '.ts');
    }
    return fileName;
  }
  
  // Handle constants
  if (fileName === 'constants.ts') {
    return 'CONSTANTS.ts';
  }
  
  // Handle types
  if (fileName === 'types.ts') {
    return 'Types.types.ts';
  }
  
  // Handle utility files
  if (fileName.includes('Helper') || fileName.includes('Fetcher') || fileName.includes('Transformer')) {
    if (fileName.endsWith('.js')) {
      return fileName.replace('.js', '.ts');
    }
    return fileName;
  }
  
  // Handle queries, fetcher, transformer files
  if (['queries.ts', 'fetcher.ts', 'transformer.ts', 'fixture.ts'].includes(fileName)) {
    return fileName;
  }
  
  // Handle index files
  if (fileName === 'index.ts' || fileName === 'index.tsx') {
    return fileName;
  }
  
  return fileName;
}

/**
 * Get the correct directory name
 */
function getCorrectDirectoryName(dirName) {
  if (dirName === '__tests__') {
    return 'tests';
  }
  return dirName;
}

/**
 * Rename a file if needed
 */
function renameFile(oldPath, newPath) {
  try {
    if (oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
      console.log(`✓ Renamed: ${oldPath} → ${newPath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Failed to rename ${oldPath}:`, error.message);
    return false;
  }
}

/**
 * Rename a directory if needed
 */
function renameDirectory(oldPath, newPath) {
  try {
    if (oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
      console.log(`✓ Renamed directory: ${oldPath} → ${newPath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Failed to rename directory ${oldPath}:`, error.message);
    return false;
  }
}

/**
 * Recursively scan and fix directory
 */
function fixDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Fix directory name
        const correctDirName = getCorrectDirectoryName(item);
        const newDirPath = path.join(dirPath, correctDirName);
        
        if (correctDirName !== item) {
          renameDirectory(fullPath, newDirPath);
          // Continue with the new path
          fixDirectory(newDirPath);
        } else {
          fixDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        // Fix file name
        const correctFileName = getCorrectFileName(fullPath, item);
        const newFilePath = path.join(dirPath, correctFileName);
        
        if (correctFileName !== item) {
          renameFile(fullPath, newFilePath);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error.message);
  }
}

/**
 * Main execution
 */
function main() {
  const targetDir = process.argv[2] || './src/components';
  
  console.log(`🔧 Fixing naming conventions in: ${targetDir}`);
  console.log(`📋 Applying strict naming patterns...\n`);
  
  fixDirectory(targetDir);
  
  console.log(`\n✅ Naming convention fixes completed!`);
  console.log(`📝 Run the validator again to verify all files follow conventions.`);
}

// Run the fixer
if (require.main === module) {
  main();
}

module.exports = {
  getCorrectFileName,
  getCorrectDirectoryName,
  renameFile,
  renameDirectory,
  fixDirectory
};
