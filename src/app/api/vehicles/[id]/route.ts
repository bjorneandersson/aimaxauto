import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/vehicles/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.vehicle.delete({ where: { id: params.id } });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "vehicle.delete",
      target: params.id,
    },
  });

  return NextResponse.json({ success: true });
}

// PATCH /api/vehicles/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const vehicle = await prisma.vehicle.update({
    where: { id: params.id },
    data: body,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "vehicle.update",
      target: params.id,
      details: body,
    },
  });

  return NextResponse.json(vehicle);
}
