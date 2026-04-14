import "dotenv/config";
import prisma from './src/lib/prisma.js';

async function main() {
  console.log('🧹 Очищаем старые кабинеты...');
  
  // Удаляем все существующие кабинеты
  await prisma.room.deleteMany({});
  
  console.log('✅ Старые кабинеты удалены');
  console.log('📚 Добавляем новые кабинеты...');

  await prisma.room.createMany({
    data: [
      { 
        name: 'Кабинет 116 (Информатика)', 
        capacity: 40, 
        description: '40 компьютеров, проектор',
        floor: 1,
        hasProjector: true,
        hasComputers: true
      },
      { 
        name: 'Кабинет 216 (Информатика х2)', 
        capacity: 30, 
        description: '30 компьютеров, интерактивная доска',
        floor: 2,
        hasProjector: true,
        hasComputers: true
      },
      { 
        name: 'Кабинет 201 (Физика)', 
        capacity: 25, 
        description: 'Лабораторное оборудование, проектор',
        floor: 2,
        hasProjector: true,
        hasComputers: false
      },
      { 
        name: 'Кабинет 202 (Химия)', 
        capacity: 20, 
        description: 'Лаборатория, вытяжка',
        floor: 2,
        hasProjector: true,
        hasComputers: false
      },
      { 
        name: 'Кабинет 301 (История)', 
        capacity: 30, 
        description: 'Карты, проектор',
        floor: 3,
        hasProjector: true,
        hasComputers: false
      },
      { 
        name: 'Кабинет 302 (Английский)', 
        capacity: 20, 
        description: 'Лингафонный кабинет',
        floor: 3,
        hasProjector: true,
        hasComputers: true
      },
    ],
  });

  console.log('✅ Кабинеты успешно добавлены!');
  
  // Выведем добавленные кабинеты для проверки
  const rooms = await prisma.room.findMany();
  console.log('📋 Список кабинетов в базе:');
  rooms.forEach(room => {
    console.log(`  - ${room.name} (${room.capacity} мест, ${room.floor} этаж)`);
  });
  
  process.exit(0);
}

main().catch(e => {
  console.error('❌ Ошибка:', e);
  process.exit(1);
});