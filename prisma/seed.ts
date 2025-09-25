import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Create artists with realistic pricing based on market data (~150% average uplift)
  const artists = [
    {
      name: 'Taylor Swift',
      slug: 'taylor-swift',
      charityName: 'Education for All',
      charityDescription: 'Supporting educational initiatives for underprivileged children worldwide',
      basePrice: 254.00, // Actual Eras Tour face value from PDF
      currentUplift: 175.0 // Conservative vs 1400% resale, but above 150% average
    },
    {
      name: 'Lady Gaga',
      slug: 'lady-gaga',
      charityName: 'Mental Health Foundation',
      charityDescription: 'Promoting mental health awareness and support services',
      basePrice: 120.00, // Based on Chromatica Ball pricing from PDF
      currentUplift: 150.0 // Matches typical resale markup range
    },
    {
      name: 'Dolly Parton',
      slug: 'dolly-parton',
      charityName: 'Imagination Library',
      charityDescription: 'Providing free books to children from birth to age 5',
      basePrice: 85.00,  // Estimated country legend pricing
      currentUplift: 140.0 // Slightly below average but substantial for charity
    },
    {
      name: 'Garth Brooks',
      slug: 'garth-brooks',
      charityName: 'Rural Education Foundation',
      charityDescription: 'Supporting educational opportunities in rural communities',
      basePrice: 100.00, // Actual Stadium Tour pricing from PDF
      currentUplift: 125.0 // Above his 20% resale markup, generous for charity
    }
  ];

  for (const artistData of artists) {
    const { basePrice, currentUplift, ...artistInfo } = artistData;

    const artist = await prisma.artist.upsert({
      where: { slug: artistData.slug },
      update: {},
      create: artistInfo,
    });

    // Create pricing for each artist
    await prisma.artistPricing.upsert({
      where: { artistId: artist.id },
      update: {
        basePrice,
        currentUplift,
      },
      create: {
        artistId: artist.id,
        basePrice,
        currentUplift,
      },
    });

    // Create a sample event for each artist
    const eventName = `${artist.name} World Tour 2025`;
    const existingEvent = await prisma.event.findFirst({
      where: {
        artistId: artist.id,
        name: eventName
      }
    });

    if (!existingEvent) {
      await prisma.event.create({
        data: {
          artistId: artist.id,
          name: eventName,
          venue: 'Madison Square Garden',
          date: new Date('2025-12-15T19:00:00Z'),
          totalTickets: 1000,
          soldTickets: Math.floor(Math.random() * 200) + 50, // Random sold tickets between 50-250
        },
      });
    }

    console.log(`Created artist: ${artist.name} with pricing and event`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });