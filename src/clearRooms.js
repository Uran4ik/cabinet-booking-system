import "dotenv/config";
import prisma from './src/lib/prisma.js';

async function main() {
  console.log('🧹 Удаляем все комнаты...');
  
  const result = await prisma.room.deleteMany({});
  console.log(`✅ Удалено комнат: ${result.count}`);
  
  process.exit(0);
}

main().catch(e => {
  console.error('❌ Ошибка:', e);
  process.exit(1);
});