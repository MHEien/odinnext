import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
        const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            role: true,
        },
    });
    if (user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await list();
    const publicImages = response.blobs.filter((blob) => blob.pathname.startsWith("public/"));
    const privateImages = response.blobs.filter((blob) => !blob.pathname.startsWith("public/"));

    return NextResponse.json({ public: publicImages, private: privateImages });
}