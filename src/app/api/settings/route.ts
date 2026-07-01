import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, requirePermission } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    settingsMap.CURRENCY = 'BDT';
    settingsMap.CURRENCY_SYMBOL = '\u09F3';
    return NextResponse.json({ settings: settingsMap, raw: settings });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userOrRes = await requirePermission(req, 'settings');
    if (userOrRes instanceof Response) return userOrRes;
    const user = userOrRes;
    const body = await req.json();

    const normalizedBody = { ...body, CURRENCY: 'BDT', CURRENCY_SYMBOL: '\u09F3' };

    for (const [key, value] of Object.entries(normalizedBody)) {
      await prisma.setting.upsert({
        where: { key },
        create: {
          key,
          value: String(value),
          category: 'GENERAL',
        },
        update: {
          value: String(value),
        },
      });
    }

    const storeUpdates: Record<string, any> = { currency: 'BDT', currencySymbol: '\u09F3' };
    if (body.TAX_RATE !== undefined) storeUpdates.taxRateDefault = Number(body.TAX_RATE);
    if (body.TAX_INCLUSIVE !== undefined) storeUpdates.taxInclusive = String(body.TAX_INCLUSIVE) === 'true';

    if (Object.keys(storeUpdates).length > 0) {
      await prisma.store.updateMany({ data: storeUpdates });
    }

    await prisma.auditLog.create({
      data: {
        userId: user?.id,
        action: 'UPDATE',
        module: 'SETTINGS',
        details: 'Updated store configuration parameters',
      },
    });

    return NextResponse.json({ success: true, message: 'Settings saved' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
