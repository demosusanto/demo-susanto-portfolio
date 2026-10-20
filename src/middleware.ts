import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "id", "ja"];
const defaultLocale = "en";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Abaikan file statis, gambar, dan asset Next.js
    if (
        pathname.includes('.') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/api/') ||
        pathname.startsWith('/projects/') // agar gambar project tidak terblokir
    ) {
        return;
    }

    // Cek apakah URL saat ini sudah memiliki bahasa (misal: /en/about atau /ja)
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    // Jika tidak ada bahasa di URL, arahkan ke default bahasa (English)
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        // Jalankan middleware ini pada semua path kecuali file statis
        '/((?!_next).*)',
    ],
};