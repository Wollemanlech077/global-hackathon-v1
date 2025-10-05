#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔍 Verifying submission requirements...\n');

let allChecksPassed = true;

// Check 1: README.md exists
console.log('📝 Checking README.md...');
if (fs.existsSync('README.md')) {
  const readmeContent = fs.readFileSync('README.md', 'utf8');
  if (readmeContent.length > 100) {
    console.log('✅ README.md exists and has content\n');
  } else {
    console.log('⚠️  README.md exists but seems too short\n');
    allChecksPassed = false;
  }
} else {
  console.log('❌ README.md not found\n');
  allChecksPassed = false;
}

// Check 2: .hackathon-start file exists
console.log('📅 Checking .hackathon-start timestamp...');
if (fs.existsSync('.hackathon-start')) {
  const timestamp = fs.readFileSync('.hackathon-start', 'utf8');
  console.log('✅ .hackathon-start file exists');
  console.log(`   Timestamp: ${timestamp.trim()}\n`);
} else {
  console.log('⚠️  .hackathon-start file not found (not critical)\n');
}

// Check 3: Git commits count
console.log('📊 Checking git commits...');
try {
  const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
  console.log(`✅ Found ${commitCount} commits`);
  
  if (parseInt(commitCount) >= 5) {
    console.log('✅ Meets minimum 5 commits requirement\n');
  } else {
    console.log('❌ Less than 5 commits found\n');
    allChecksPassed = false;
  }
} catch (error) {
  console.log('⚠️  Could not check git commits\n');
}

// Check 4: Check if it's a git repo
console.log('🔗 Checking git repository...');
if (fs.existsSync('.git')) {
  console.log('✅ Git repository initialized\n');
  
  try {
    const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
    console.log('🌐 Remote repository:');
    console.log(`   ${remoteUrl}\n`);
  } catch (error) {
    console.log('⚠️  No remote repository configured\n');
  }
} else {
  console.log('❌ Not a git repository\n');
  allChecksPassed = false;
}

// Check 5: Check for main project files
console.log('📦 Checking project structure...');
const requiredFiles = ['package.json', 'src', 'public'];
let missingFiles = [];

requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    missingFiles.push(file);
  }
});

if (missingFiles.length === 0) {
  console.log('✅ All required project files/folders exist\n');
} else {
  console.log(`❌ Missing: ${missingFiles.join(', ')}\n`);
  allChecksPassed = false;
}

// Final summary
console.log('━'.repeat(50));
if (allChecksPassed) {
  console.log('\n🎉 All checks passed! You\'re ready to submit.\n');
  console.log('📋 Before submitting, make sure you have:');
  console.log('   1. ✅ 60-second demo video (Loom/YouTube - public)');
  console.log('   2. ✅ Live deployment URL (Vercel/Netlify/Railway)');
  console.log('   3. ✅ GitHub repo is public');
  console.log('\n📤 Submit at: https://forms.acta.so/r/wMobdM\n');
} else {
  console.log('\n⚠️  Some checks failed. Please fix the issues above.\n');
  process.exit(1);
}

