#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying hackathon submission...\n');

// Check if .hackathon-start exists
const hackathonStartPath = '.hackathon-start';
if (!fs.existsSync(hackathonStartPath)) {
  console.error('❌ .hackathon-start file not found!');
  console.log('   Run: date > .hackathon-start');
  process.exit(1);
}

// Check if package.json exists
const packageJsonPath = 'package.json';
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found!');
  process.exit(1);
}

// Check if README.md exists
const readmePath = 'README.md';
if (!fs.existsSync(readmePath)) {
  console.error('❌ README.md not found!');
  process.exit(1);
}

// Check git status
const { execSync } = require('child_process');
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim()) {
    console.log('⚠️  Warning: You have uncommitted changes');
    console.log('   Consider committing your work before submission');
  }
} catch (error) {
  console.error('❌ Git repository not found or git not available');
  process.exit(1);
}

// Check commit count
try {
  const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
  console.log(`📊 Total commits: ${commitCount}`);
  
  if (parseInt(commitCount) < 5) {
    console.log('⚠️  Warning: You have fewer than 5 commits');
    console.log('   Consider making more commits to meet the minimum requirement');
  }
} catch (error) {
  console.error('❌ Could not count commits');
  process.exit(1);
}

// Check if project builds
console.log('\n🔨 Checking if project builds...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Project builds successfully');
} catch (error) {
  console.error('❌ Project build failed');
  console.log('   Make sure to run: npm install && npm run build');
  process.exit(1);
}

console.log('\n✅ Submission verification completed!');
console.log('\n📋 Submission checklist:');
console.log('   □ Public GitHub repo URL');
console.log('   □ 60-second demo video (Loom/YouTube - must be public)');
console.log('   □ Live demo URL (deployed app)');
console.log('   □ Your email and name');
console.log('\n🚀 Ready to submit at: https://forms.acta.so/r/wMobdM');
