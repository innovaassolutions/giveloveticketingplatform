import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'merchandise.json');

interface MerchandiseItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'apparel' | 'accessories' | 'collectibles';
  sizes?: string[];
  colors?: string[];
}

interface MerchandiseData {
  merchandise: MerchandiseItem[];
}

// Helper function to read merchandise data
function readMerchandiseData(): MerchandiseData {
  try {
    const fileContents = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading merchandise data:', error);
    return { merchandise: [] };
  }
}

// Helper function to write merchandise data
function writeMerchandiseData(data: MerchandiseData): boolean {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing merchandise data:', error);
    return false;
  }
}

// GET - Retrieve all merchandise
export async function GET() {
  try {
    const data = readMerchandiseData();
    return NextResponse.json(data.merchandise);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch merchandise' },
      { status: 500 }
    );
  }
}

// POST - Add new merchandise item
export async function POST(request: NextRequest) {
  try {
    const newItem: Omit<MerchandiseItem, 'id'> = await request.json();

    // Validate required fields
    if (!newItem.name || !newItem.description || !newItem.price || !newItem.image || !newItem.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const data = readMerchandiseData();

    // Generate unique ID
    const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const itemWithId: MerchandiseItem = {
      id,
      ...newItem
    };

    data.merchandise.push(itemWithId);

    if (writeMerchandiseData(data)) {
      return NextResponse.json(itemWithId, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Failed to save merchandise' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

// PUT - Update existing merchandise item
export async function PUT(request: NextRequest) {
  try {
    const updatedItem: MerchandiseItem = await request.json();

    // Validate required fields
    if (!updatedItem.id || !updatedItem.name || !updatedItem.description || !updatedItem.price || !updatedItem.image || !updatedItem.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const data = readMerchandiseData();
    const itemIndex = data.merchandise.findIndex(item => item.id === updatedItem.id);

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    data.merchandise[itemIndex] = updatedItem;

    if (writeMerchandiseData(data)) {
      return NextResponse.json(updatedItem);
    } else {
      return NextResponse.json(
        { error: 'Failed to update merchandise' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

// DELETE - Remove merchandise item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const data = readMerchandiseData();
    const itemIndex = data.merchandise.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const deletedItem = data.merchandise.splice(itemIndex, 1)[0];

    if (writeMerchandiseData(data)) {
      return NextResponse.json({ message: 'Item deleted successfully', item: deletedItem });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete merchandise' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}