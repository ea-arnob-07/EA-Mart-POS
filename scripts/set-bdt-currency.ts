import prisma from '../src/lib/prisma';

async function main() {
  await prisma.store.updateMany({
    data: {
      currency: 'BDT',
      currencySymbol: '\u09F3',
    },
  });

  const stores = await prisma.store.findMany({ select: { id: true, name: true } });
  for (const store of stores) {
    const name = store.name.replace(/^NexaMart/, 'EA Mart');
    if (name !== store.name) {
      await prisma.store.update({ where: { id: store.id }, data: { name } });
    }
  }

  const demoAccounts = [
    'admin',
    'owner',
    'manager',
    'cashier',
    'inventory',
    'purchasing',
    'accountant',
    'warehouse',
    'auditor',
  ];

  for (const account of demoAccounts) {
    const oldEmail = `${account}@nexamart.com`;
    const newEmail = `${account}@eamart.test`;
    const oldUser = await prisma.user.findUnique({ where: { email: oldEmail } });
    const newUser = await prisma.user.findUnique({ where: { email: newEmail } });
    if (oldUser && !newUser) {
      await prisma.user.update({ where: { id: oldUser.id }, data: { email: newEmail } });
    }
  }

  const settings = [
    { key: 'CURRENCY', value: 'BDT', category: 'GENERAL', description: 'Base store currency' },
    { key: 'CURRENCY_SYMBOL', value: '\u09F3', category: 'GENERAL', description: 'Currency symbol' },
    { key: 'STORE_NAME', value: 'EA Mart Flagship Superstore', category: 'GENERAL', description: 'Store trading name' },
    { key: 'RECEIPT_HEADER', value: 'EA Mart Flagship Superstore\nDhaka, Bangladesh\nPhone: [Store phone]\nBIN: [Business Identification Number]', category: 'RECEIPT', description: 'Thermal receipt header' },
    { key: 'RECEIPT_FOOTER', value: 'Thank you for shopping at EA Mart!\nPlease retain your receipt for returns or exchanges within 14 days.', category: 'RECEIPT', description: 'Thermal receipt footer text' },
  ];

  for (const setting of settings) {
    const existing = await prisma.setting.findUnique({ where: { key: setting.key } });
    let value = existing?.value || setting.value;
    if (['CURRENCY', 'CURRENCY_SYMBOL'].includes(setting.key)) {
      value = setting.value;
    } else {
      value = value.replace(/\n?Visit us online at www\.nexamart\.com/gi, '').replace(/NexaMart/g, 'EA Mart').replace(/\n\s*$/, '');
    }
    if (setting.key === 'RECEIPT_FOOTER' && value.trim() === '') value = setting.value;

    await prisma.setting.upsert({
      where: { key: setting.key },
      create: { ...setting, value },
      update: { value },
    });
  }

  console.log('EA Mart is configured for BDT (Bangladeshi Taka). Existing tax settings and numeric amounts were preserved.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
