# Liquid Glass - Setup Guide

## Environment Variables Setup

This app uses the Unsplash API to fetch background images. To use this feature, you need to add your Unsplash API key.

### Step 1: Get Your Unsplash API Key

1. Go to https://unsplash.com/developers
2. Sign up or log in
3. Click "New Application"
4. Accept the terms
5. Fill in the application details
6. Copy your **Access Key**

### Step 2: Add API Key to .env File

1. Open the `.env` file in the root directory
2. Replace `YOUR_ACCESS_KEY_HERE` with your actual Unsplash Access Key:

```bash
VITE_UNSPLASH_ACCESS_KEY=your_actual_access_key_here
```

3. Save the file

### Step 3: Restart Dev Server

```bash
npm run dev
```

### Step 4: Test It

1. Open http://localhost:5174/
2. Scroll to the "Background" section in the controls
3. Type a keyword (e.g., "ocean", "mountain", "city")
4. Click "Search image" or press Enter
5. The background should update with a random image!

## Security Notes

- ✅ `.env` file is in `.gitignore` (won't be committed to git)
- ✅ `.env.example` is committed (shows structure without exposing keys)
- ⚠️ API key is still visible in browser (embedded in built JavaScript)
- 💡 For production: Use a backend proxy or serverless function

## Free Tier Limits

- **50 requests per hour**
- Sufficient for development and testing
- Consider caching images if building a production app

## Troubleshooting

**"Unsplash API key not configured" error:**
- Make sure `.env` file exists
- Make sure the key is named `VITE_UNSPLASH_ACCESS_KEY`
- Restart the dev server after adding the key

**"Invalid Unsplash API key" error:**
- Double-check your Access Key is correct
- Make sure you copied the Access Key (not Secret Key)

**"Rate limit exceeded" error:**
- You've hit the 50 requests/hour limit
- Wait an hour or create a new app for a fresh limit
