import { prisma } from "@/lib/prisma";
import ModerationQueue from "@/components/admin/ModerationQueue";

async function getFlaggedContent() {
  const [flaggedPosts, flaggedComments] = await Promise.all([
    prisma.post.findMany({
      where: { OR: [{ isFlagged: true }, { isHidden: true }] },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, _count: { select: { comments: true } } },
      take: 50,
    }),
    prisma.comment.findMany({
      where: { isHidden: true },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, post: { select: { id: true, content: true } } },
      take: 50,
    }),
  ]);

  return { flaggedPosts, flaggedComments };
}

export default async function ModerationPage() {
  const { flaggedPosts, flaggedComments } = await getFlaggedContent();

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Moderation</h1>
        <p className="text-text-secondary text-sm mt-1">
          Review flagged and hidden content
        </p>
      </div>

      <ModerationQueue
        posts={JSON.parse(JSON.stringify(flaggedPosts))}
        comments={JSON.parse(JSON.stringify(flaggedComments))}
      />
    </div>
  );
}
