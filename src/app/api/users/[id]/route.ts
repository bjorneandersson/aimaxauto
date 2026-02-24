import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/users/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const allowedFields = ["role", "plan", "airaCredits"];
  const data: Record<string, any> = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "user.update",
      target: params.id,
      details: data,
    },
  });

  return NextResponse.json(user);
}
