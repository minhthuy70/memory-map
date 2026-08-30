import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Love' },
      update: {},
      create: { name: 'Love', icon: '❤️' },
    }),
    prisma.category.upsert({
      where: { name: 'Family' },
      update: {},
      create: { name: 'Family', icon: '👨‍👩‍👧' },
    }),
    prisma.category.upsert({
      where: { name: 'Friends' },
      update: {},
      create: { name: 'Friends', icon: '👥' },
    }),
    prisma.category.upsert({
      where: { name: 'Study' },
      update: {},
      create: { name: 'Study', icon: '🎓' },
    }),
    prisma.category.upsert({
      where: { name: 'Work' },
      update: {},
      create: { name: 'Work', icon: '💼' },
    }),
    prisma.category.upsert({
      where: { name: 'Travel' },
      update: {},
      create: { name: 'Travel', icon: '✈️' },
    }),
    prisma.category.upsert({
      where: { name: 'Event' },
      update: {},
      create: { name: 'Event', icon: '🎉' },
    }),
    prisma.category.upsert({
      where: { name: 'Personal' },
      update: {},
      create: { name: 'Personal', icon: '🌱' },
    }),
    prisma.category.upsert({
      where: { name: 'Other' },
      update: {},
      create: { name: 'Other', icon: '⭐' },
    }),
  ]);

  console.log('Categories seeded:', categories.length);

  // Create test user
  const passwordHash = await import('bcrypt').then(bcrypt => bcrypt.hash('password123', 10));
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      passwordHash,
      name: 'Test User',
    },
  });

  console.log('Test user created:', user.email);

  // Create sample memories
  const studyCategory = categories.find(c => c.name === 'Study');
  const personalCategory = categories.find(c => c.name === 'Personal');
  const travelCategory = categories.find(c => c.name === 'Travel');

  if (studyCategory && personalCategory && travelCategory) {
    const memories = await Promise.all([
      prisma.memory.create({
        data: {
          userId: user.id,
          title: 'Ngày đầu tiên đi học đại học',
          content: 'Hôm đó là ngày đầu tiên mình bước vào trường đại học. Mình cảm thấy rất hào hứng và lo lắng cùng lúc.',
          latitude: 21.0059,
          longitude: 105.8434,
          locationName: 'Đại học Quốc gia Hà Nội',
          memoryDate: new Date('2022-09-05'),
          mood: 'HAPPY',
          categoryId: studyCategory.id,
        },
      }),
      prisma.memory.create({
        data: {
          userId: user.id,
          title: 'Quán cafe quen thuộc',
          content: 'Lần đầu ngồi ở đây làm đồ án với nhóm bạn. Chúng ta đã làm việc đến tận khuya.',
          latitude: 21.0285,
          longitude: 105.8542,
          locationName: 'The Coffee House',
          memoryDate: new Date('2023-03-15'),
          mood: 'PEACEFUL',
          categoryId: personalCategory.id,
        },
      }),
      prisma.memory.create({
        data: {
          userId: user.id,
          title: 'Chuyến đi đáng nhớ',
          content: 'Chuyến đi Đà Lạt cùng bạn thân. Thời tiết tuyệt vời và chúng ta đã chụp rất nhiều ảnh đẹp.',
          latitude: 11.9404,
          longitude: 108.4583,
          locationName: 'Đà Lạt',
          memoryDate: new Date('2023-07-20'),
          mood: 'EXCITED',
          categoryId: travelCategory.id,
        },
      }),
    ]);

    console.log('Sample memories created:', memories.length);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
