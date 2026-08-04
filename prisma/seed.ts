import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@xalat.sn' },
    update: {},
    create: {
      email: 'admin@xalat.sn',
      name: 'Mamadou Sow',
      phone: '+221 70 111 22 33',
      role: 'admin',
      status: 'actif',
      commune: 'Almadies, Dakar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      badgeTitle: 'Super Administrateur',
    },
  });

  await prisma.category.upsert({
    where: { name: 'Routes & Voirie' },
    update: {},
    create: {
      name: 'Routes & Voirie',
      icon: 'Route',
      color: '#0D47A1',
      count: 42,
      description: 'Nids de poule, dalles endommagées, chaussée dégradée',
    },
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
