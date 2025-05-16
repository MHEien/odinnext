import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(request: Request) {

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

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const publicBool = formData.get("public") === "true";
        const { url } = await put(publicBool ? "public/" + file.name : file.name, file, { access: "public", allowOverwrite: true, onUploadProgress: (progress) => {
            console.log("Upload progress", progress);
        } });
        return NextResponse.json({ url });
    } catch (error) {
        console.error("Error uploading image", error);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
}
