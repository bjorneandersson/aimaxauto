import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/moderation/posts/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action } = await req.json();

  if (action === "approve") {
    await prisma.post.update({
      where: { id: params.id },
      data: {
        isFlagged: false,
        isHidden: false,
        moderatedAt: new Date(),
        moderatedBy: session.user.id,
      },
    });
  } else if (action === "hide") {
    await prisma.post.update({
      where: { id: params.id },
      data: {
        isHidden: true,
        moderatedAt: new Date(),
        moderatedBy: session.user.id,
      },
    });
  } else if (action === "delete") {
    await prisma.post.delete({ where: { id: params.id } });
  }

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: `moderation.post.${action}`,
      target: params.id,
    },
  });

  return NextResponse.json({ success: true });
}
