import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

function checkRevalidationAuth(request: NextRequest): boolean {
  const expectedSecret =
    process.env.REVALIDATION_SECRET || "abuja-resilience-revalidate-2025";

  // Check URL search parameters: ?secret=...
  const url = request.nextUrl || (request.url ? new URL(request.url) : null);
  const urlSecret = url?.searchParams.get("secret");
  if (urlSecret && urlSecret === expectedSecret) {
    return true;
  }

  // Check Authorization: Bearer <secret>
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    if (bearerToken === expectedSecret) {
      return true;
    }
  }

  return false;
}

function handleRevalidation(request: NextRequest) {
  if (!checkRevalidationAuth(request)) {
    return NextResponse.json(
      {
        revalidated: false,
        message: "Invalid secret token",
      },
      { status: 401 }
    );
  }

  try {
    revalidateTag("ngo-content");
  } catch (error) {
    console.warn("revalidateTag('ngo-content') warning:", error);
  }

  try {
    revalidatePath("/");
  } catch (error) {
    console.warn("revalidatePath('/') warning:", error);
  }

  return NextResponse.json(
    {
      revalidated: true,
      now: Date.now(),
    },
    { status: 200 }
  );
}

export async function GET(request: NextRequest) {
  return handleRevalidation(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidation(request);
}
