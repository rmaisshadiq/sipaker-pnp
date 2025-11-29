import { getUploadAuthParams } from "@imagekit/next/server"
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const expireTime = Math.floor(Date.now() / 1000) + 1800;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_KEY;

    if (!privateKey || !publicKey) {
      return NextResponse.json(
        { error: "Environment variables ImageKit belum lengkap." },
        { status: 500 }
      );
    }

    const authParams = getUploadAuthParams({
      privateKey,
      publicKey,
      expire: expireTime, // Opsional: token berlaku 30 menit
    });

    return NextResponse.json({ 
      ...authParams,
      publicKey
    });

  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    return NextResponse.json(
      { error: "Gagal membuat token autentikasi." },
      { status: 500 }
    );
  }
}