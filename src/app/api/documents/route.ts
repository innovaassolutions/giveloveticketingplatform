import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { put } from '@vercel/blob';

export async function GET() {
  try {
    const documents = await db.investorDocument.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type (PDF or Markdown)
    const allowedTypes = ['application/pdf', 'text/markdown', 'text/plain'];
    const isMarkdown = file.name.endsWith('.md') || file.name.endsWith('.markdown');

    if (!allowedTypes.includes(file.type) && !isMarkdown) {
      return NextResponse.json({ error: 'Only PDF and Markdown files are allowed' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `investor-documents/${timestamp}_${sanitizedFileName}`;

    // Upload to Vercel Blob
    const blob = await put(uniqueFileName, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    // Save to database
    const document = await db.investorDocument.create({
      data: {
        name: file.name,
        fileName: sanitizedFileName,
        filePath: blob.url,
        fileSize: file.size,
        mimeType: file.type || (isMarkdown ? 'text/markdown' : 'application/pdf')
      }
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}
