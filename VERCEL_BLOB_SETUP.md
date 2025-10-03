# Vercel Blob Storage Setup Guide

This guide will help you set up Vercel Blob storage for document uploads in production.

## Why Vercel Blob?

Vercel's serverless functions have a **read-only filesystem**, which means traditional file uploads using `fs.writeFile()` don't work in production. Vercel Blob provides:

- ✅ Persistent file storage that works in serverless environments
- ✅ Global CDN for fast file delivery
- ✅ Automatic file optimization
- ✅ Simple API integration

## Setup Steps

### 1. Create a Vercel Blob Store

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project: **giveloveticketingplatform**
3. Click on the **Storage** tab
4. Click **Create Database** or **Create Store**
5. Select **Blob** as the storage type
6. Give it a name (e.g., `investor-documents`)
7. Click **Create**

### 2. Get Your Blob Token

After creating the store:

1. You'll see a `BLOB_READ_WRITE_TOKEN` displayed
2. Copy this token value
3. Keep it secure - this is your API key for blob storage

### 3. Add Token to Local Development

Add the token to your `.env.local` file:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXXXXXXX
```

### 4. Add Token to Vercel Production

1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Key**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Your blob token from step 2
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**

### 5. Deploy to Production

After adding the environment variable:

```bash
git add .
git commit -m "Add Vercel Blob storage for document uploads"
git push origin main
```

Vercel will automatically deploy with the new environment variable.

## How It Works

### Before (Filesystem - Fails in Production)
```javascript
// ❌ This doesn't work on Vercel
await writeFile('/public/uploads/document.pdf', buffer);
```

### After (Vercel Blob - Works Everywhere)
```javascript
// ✅ This works in both development and production
import { put } from '@vercel/blob';

const blob = await put('investor-documents/document.pdf', file, {
  access: 'public',
});

// Returns: { url: 'https://xxxxxxx.public.blob.vercel-storage.com/...' }
```

## File Storage Structure

Files are stored with this structure in Vercel Blob:

```
investor-documents/
  ├── 1234567890_Financial_Projections.pdf
  ├── 1234567891_Product_Roadmap.md
  └── 1234567892_Team_Overview.pdf
```

Each file gets:
- A timestamp prefix for uniqueness
- Sanitized filename (no special characters)
- Public CDN URL for fast access

## Testing

### Local Development
1. Make sure `BLOB_READ_WRITE_TOKEN` is in your `.env.local`
2. Start dev server: `npm run dev`
3. Navigate to `/documents` (after investor login)
4. Try uploading a PDF or Markdown file
5. Verify it appears in the list and can be viewed

### Production
1. Deploy to Vercel
2. Navigate to your production URL: `https://giveback-omega.vercel.app/documents`
3. Upload a document
4. Verify it uploads successfully and displays

## Troubleshooting

### "Failed to upload file" Error

**Cause**: Missing or invalid `BLOB_READ_WRITE_TOKEN`

**Fix**:
1. Verify token exists in Vercel environment variables
2. Redeploy after adding the token
3. Check Vercel logs for detailed error messages

### File Upload Works Locally but Not in Production

**Cause**: Environment variable not set in Vercel

**Fix**:
1. Go to Vercel → Project Settings → Environment Variables
2. Add `BLOB_READ_WRITE_TOKEN`
3. Redeploy

### Blob Store Not Created

**Cause**: No blob store exists yet

**Fix**: Follow Step 1 above to create a new blob store in Vercel dashboard

## Costs

Vercel Blob pricing (as of 2024):
- **Free Tier**: 500 MB storage + 1 GB bandwidth
- **Pro**: $0.15/GB storage + $0.30/GB bandwidth

For investor documents, this should be well within free tier limits.

## Migration from Filesystem

Old documents stored in `/public/uploads/documents/` will need to be:
1. Manually uploaded through the new interface, OR
2. Migrated using a script to upload existing files to Vercel Blob

The database `filePath` field now stores Blob URLs instead of local paths:
- Old: `/uploads/documents/1234567890_file.pdf`
- New: `https://xxxxxxx.public.blob.vercel-storage.com/investor-documents/1234567890_file.pdf`

## Support

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Blob SDK on npm](https://www.npmjs.com/package/@vercel/blob)
- [Vercel Support](https://vercel.com/support)
# Vercel Blob Storage Configuration

This project uses Vercel Blob for document storage in production.

## Status
✅ Blob store connected: `investor-documents`
✅ Environment variable configured: `BLOB_READ_WRITE_TOKEN`

Production document uploads are now fully operational.
