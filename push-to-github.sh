#!/bin/bash

# Push Cago to GitHub
# Replace YOUR_USERNAME with your GitHub username

echo "🚀 Pushing Cago to GitHub..."
echo ""
echo "Please enter your GitHub username:"
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
  echo "❌ GitHub username is required!"
  exit 1
fi

echo ""
echo "📦 Adding remote repository..."
git remote add origin https://github.com/$GITHUB_USERNAME/career-gps.git 2>/dev/null || git remote set-url origin https://github.com/$GITHUB_USERNAME/career-gps.git

echo "🌿 Setting branch to main..."
git branch -M main

echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Your code is on GitHub!"
echo "🔗 Visit: https://github.com/$GITHUB_USERNAME/career-gps"

