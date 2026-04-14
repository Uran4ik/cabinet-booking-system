import "dotenv/config";
import prisma from './src/lib/prisma.js';

async function main() {
  console.log('🔍 Проверяем содержимое базы данных...\n');
  
  // Проверяем все записи в Room
  const rooms = await prisma.room.findMany();
  console.log(`📋 Найдено ${rooms.length} записей в таблице Room:`);
  rooms.forEach(r => {
    console.log(`  - ID: ${r.id}`);
    console.log(`    Название: ${r.name}`);
    console.log(`    Вместимость: ${r.capacity}`);
    console.log(`    Этаж: ${r.floor ?? 'не указан'}`);
    console.log('---');
  });
  
  // Принудительно удаляем ВСЕ записи
  console.log('\n🗑️ Удаляем все записи из Room...');
  const deleteResult = await prisma.room.deleteMany({});
  console.log(`✅ Удалено записей: ${deleteResult.count}`);
  
  // Добавляем кабинеты
  console.log('\n📚 Добавляем кабинеты...');
  await prisma.room.createMany({
    data: [
      { name: 'Кабинет 116 (Информатика)', capacity: 40, description: '40 компьютеров, проектор', floor: 1, hasProjector: true, hasComputers: true },
      { name: 'Кабинет 216 (Информатика х2)', capacity: 30, description: '30 компьютеров, интерактивная доска', floor: 2, hasProjector: true, hasComputers: true },
      { name: 'Кабинет 201 (Физика)', capacity: 25, description: 'Лабораторное оборудование, проектор', floor: 2, hasProjector: true, hasComputers: false },
      { name: 'Кабинет 202 (Химия)', capacity: 20, description: 'Лаборатория, вытяжка', floor: 2, hasProjector: true, hasComputers: false },
      { name: 'Кабинет 301 (История)', capacity: 30, description: 'Карты, проектор', floor: 3, hasProjector: true, hasComputers: false },
      { name: 'Кабинет 302 (Английский)', capacity: 20, description: 'Лингафонный кабинет', floor: 3, hasProjector: true, hasComputers: true },
    ],
  });
  
  // Проверяем результат
  const newRooms = await prisma.room.findMany();
  console.log(`\n✅ Добавлено ${newRooms.length} кабинетов:`);
  newRooms.forEach(r => console.log(`  - ${r.name}`));
  
  process.exit(0);
}

main().catch(e => {
  console.error('❌ Ошибка:', e);
  process.exit(1);
});  