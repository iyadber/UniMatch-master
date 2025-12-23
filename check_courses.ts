import { prisma } from './src/lib/prisma';

async function main() {
  try {
    const count = await prisma.course.count();
    console.log('Total courses in database:', count);
    if (count > 0) {
      const courses = await prisma.course.findMany({ take: 3 });
      console.log('Sample courses:', JSON.stringify(courses, null, 2));
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
