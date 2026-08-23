const { PrismaClient } = require('@prisma/client');
// Construct with an empty config object to avoid runtime initialization issues
const prisma = new PrismaClient({});

async function main() {
  try {
    const offers = await prisma.jobOffer.findMany({ take: 5 });
    console.log('Found', offers.length, 'offers');
    offers.forEach((o, i) => {
      console.log(`--- Offer ${i+1} ---`);
      console.log('id:', o.id);
      console.log('title:', o.title);
      console.log('pdfUrl:', o.pdfUrl);
      console.log('applicationDocuments:', o.applicationDocuments);
    });

    // Inspect columns via raw query
    const res = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='job_offers'`;
    console.log('\njob_offers columns:');
    console.table(res);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();