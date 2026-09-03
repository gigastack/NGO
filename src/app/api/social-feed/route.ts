import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { SocialFeedItemSchema, type SocialFeedItem } from "@/lib/schema/ngo.schema";

export const dynamic = "force-static";
export const revalidate = 300;

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "content", "social-feed.json");
    const rawContent = await fs.readFile(filePath, "utf-8");
    const parsedJson = JSON.parse(rawContent);

    // Validate using Zod schema array
    const validatedItems: SocialFeedItem[] = Array.isArray(parsedJson)
      ? parsedJson.map((item) => SocialFeedItemSchema.parse(item))
      : [];

    const responsePayload = {
      items: validatedItems,
      cachedAt: new Date().toISOString(),
    };

    return NextResponse.json(responsePayload, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to load social feed items:", error);
    return NextResponse.json(
      {
        error: "Failed to load social feed items",
        items: [],
        cachedAt: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
