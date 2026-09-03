import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { loadNGOConfig, writeNGOConfig, NGOConfigSchema } from "@/lib/config-loader";

export const dynamic = "force-dynamic";

function verifyPassphrase(request: NextRequest): boolean {
  const expectedPassphrase =
    process.env.ADMIN_PASSPHRASE || "abuja-resilience-2025";

  // Check x-admin-passphrase header
  const headerPassphrase = request.headers.get("x-admin-passphrase");
  if (headerPassphrase && headerPassphrase === expectedPassphrase) {
    return true;
  }

  // Check Authorization: Bearer <passphrase>
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    if (bearerToken === expectedPassphrase) {
      return true;
    }
  }

  return false;
}

export async function GET() {
  try {
    const config = loadNGOConfig();
    return NextResponse.json(config, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error loading config";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Passphrase validation
    if (!verifyPassphrase(request)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid or missing admin passphrase",
        },
        { status: 401 }
      );
    }

    // 2. Parse request JSON body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // 3. Validate against NGOConfigSchema
    const parseResult = NGOConfigSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed against NGOConfigSchema",
          issues: parseResult.error.issues,
        },
        { status: 400 }
      );
    }

    // 4. Atomically persist back to content/
    await writeNGOConfig(parseResult.data);

    // 5. Revalidate cache
    try {
      revalidatePath("/");
    } catch (revalidateError) {
      console.warn("revalidatePath('/') warning:", revalidateError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Configuration updated and cached refreshed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to persist configuration";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
