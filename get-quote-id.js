const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const quote = await prisma.quote.findFirst();
  if (quote) {
    console.log('ID:' + quote.id);
  } else {
    console.log('NO_QUOTE');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  });
