'use server'; // Wajib Server Action

import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit"; // Sesuaikan path import
import { redirect } from "next/navigation";

export const checkLoginRateLimit = async () => {
    const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
    
    // Cek limit
    const { success } = await ratelimit.limit(ip);

    // Jika kena limit, redirect (akan melempar error NEXT_REDIRECT)
    // JANGAN bungkus ini dengan try-catch yang menelan error redirect
    if (!success) {
        redirect('/too-fast');
    }

    return { success: true };
};