import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken, UserRole } from '@/lib/auth';

const isProduction = process.env.NODE_ENV === 'production';

const demoAccounts: Record<UserRole, string> = {
  SUPER_ADMIN: 'admin@eamart.test',
  STORE_OWNER: 'owner@eamart.test',
  STORE_MANAGER: 'manager@eamart.test',
  CASHIER: 'cashier@eamart.test',
  INVENTORY_MANAGER: 'inventory@eamart.test',
  PURCHASING_OFFICER: 'purchasing@eamart.test',
  ACCOUNTANT: 'accountant@eamart.test',
  WAREHOUSE_STAFF: 'warehouse@eamart.test',
  AUDITOR: 'auditor@eamart.test',
};

export async function POST(req: NextRequest) {
  if (isProduction) {
    return NextResponse.json({ error: 'Demo role login is disabled in production.' }, { status: 404 });
  }

  try {
    const { role } = await req.json();
    const email = demoAccounts[role as UserRole];

    if (!email) {
      return NextResponse.json({ error: 'Select a valid demo role.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { store: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Demo account not found. Run the database seed first.' }, { status: 404 });
    }

    const authUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      role: user.role as UserRole,
      storeId: user.storeId,
    };
    const token = signToken(authUser);
    const activeShift = await prisma.shift.findFirst({
      where: { userId: user.id, status: 'OPEN' },
      include: { register: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        module: 'USERS',
        details: 'Demo workspace opened as ' + user.role,
        storeId: user.storeId,
      },
    });

    const response = NextResponse.json({ success: true, user: authUser, store: user.store, activeShift });
    response.cookies.set('nexamart_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Unable to open the selected demo workspace.' }, { status: 500 });
  }
}
