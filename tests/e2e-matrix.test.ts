import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { NextRequest } from "next/server";
import { loadNGOConfig, clearNGOConfigCache, writeNGOConfig } from "@/lib/config-loader";
import { resolveMediaUrl, getMediaDimensions } from "@/lib/media/resolver";
import { NGOConfigSchema, BankingSchema } from "@/lib/schema/ngo.schema";
import { GET as getAdminConfig, POST as postAdminConfig } from "@/app/api/admin/config/route";
import { GET as getRevalidate, POST as postRevalidate } from "@/app/api/revalidate/route";
import { GET as getSocialFeed } from "@/app/api/social-feed/route";
import type { NGOConfig } from "@/lib/schema/ngo.schema";

describe("PLAN_V1 End-to-End Test Matrix", () => {
  beforeEach(() => {
    clearNGOConfigCache();
  });

  afterEach(() => {
    clearNGOConfigCache();
  });

  // 1. Schema Guardrail & Validation Test
  it("Matrix 2: Schema Guardrail - rejects invalid 5-digit bank account number", () => {
    const invalidBanking = {
      ngnAccount: {
        bankName: "Guaranty Trust Bank (GTBank)",
        accountName: "Abuja Resilience Initiative",
        accountNumber: "12345", // Invalid: must be 10 digits
        sortCode: "058152062",
        whatsappConfirmationPhone: "+2348039001234",
      },
      domiciliaryAccounts: [],
      donationTiers: [
        {
          id: "tier-1",
          amountNgn: 5000,
          amountUsd: 15,
          label: "Community Water Access",
          impactDescription: "Provides water access",
        },
      ],
    };

    const parseResult = BankingSchema.safeParse(invalidBanking);
    expect(parseResult.success).toBe(false);
    if (!parseResult.success) {
      const issue = parseResult.error.issues.find((i) =>
        i.path.includes("accountNumber")
      );
      expect(issue).toBeDefined();
    }
  });

  // 2. Cloudinary Media Resolver Test
  it("Matrix 3: Cloudinary Resolver formats dynamic transformation URLs", async () => {
    const config = await loadNGOConfig();
    const cloudinaryConfig: NGOConfig = {
      ...config,
      media: {
        ...config.media,
        storage: {
          provider: "cloudinary",
          cloudinary: {
            cloudName: "abuja-resilience",
            folder: "portal-assets",
            secure: true,
          },
          s3: {
            bucket: "abuja-resilience-media",
            region: "af-south-1",
          },
          local: {
            basePath: "/media",
          },
        },
      },
    };

    const url = resolveMediaUrl(
      "image-monolith-civic.webp",
      { width: 1200, format: "webp" },
      cloudinaryConfig
    );

    expect(url).toContain("res.cloudinary.com/abuja-resilience/image/upload");
    expect(url).toContain("w_1200");
    expect(url).toContain("f_webp");
    expect(url).toContain("portal-assets/image-monolith-civic.webp");
  });

  // 3. Storage Provider Switch to Local & S3 Test
  it("Matrix 4: Storage Provider cleanly switches to Local and S3", async () => {
    const config = await loadNGOConfig();

    // Local Strategy
    const localConfig: NGOConfig = {
      ...config,
      media: {
        ...config.media,
        storage: {
          ...config.media.storage,
          provider: "local",
          local: { basePath: "/media" },
        },
      },
    };
    const localUrl = resolveMediaUrl("image-health-outreach.webp", {}, localConfig);
    expect(localUrl).toBe("/media/image-health-outreach.webp");

    // S3 Strategy
    const s3Config: NGOConfig = {
      ...config,
      media: {
        ...config.media,
        storage: {
          ...config.media.storage,
          provider: "s3",
          s3: {
            bucket: "abuja-resilience-media",
            region: "af-south-1",
          },
        },
      },
    };
    const s3Url = resolveMediaUrl("image-health-outreach.webp", {}, s3Config);
    expect(s3Url).toContain("https://abuja-resilience-media.s3.af-south-1.amazonaws.com/image-health-outreach.webp");
  });

  // 4. Easy Content Editing & Zero-Hardcoding Test
  it("Matrix 5: Zero-Hardcoding - Environment overrides take dynamic precedence", async () => {
    process.env.NEXT_PUBLIC_NGO_NAME = "Zuma Heritage Trust";
    clearNGOConfigCache();

    const config = await loadNGOConfig();
    expect(config.organization.tradingName).toBe("Zuma Heritage Trust");

    // Cleanup
    delete process.env.NEXT_PUBLIC_NGO_NAME;
    clearNGOConfigCache();

    const restoredConfig = await loadNGOConfig();
    expect(restoredConfig.organization.tradingName).toBe("Abuja Resilience Initiative");
  });

  // 5. In-App Visual Content Studio (/admin) API Test
  it("Matrix 6: /api/admin/config rejects unauthorized requests and accepts valid authenticated updates", async () => {
    // GET test
    const getRes = await getAdminConfig();
    expect(getRes.status).toBe(200);
    const initialConfig = await getRes.json();
    expect(initialConfig.organization.tradingName).toBe("Abuja Resilience Initiative");

    // POST Unauthorized test (wrong passphrase)
    const badPostReq = new NextRequest("http://localhost:3000/api/admin/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-passphrase": "wrong-passphrase",
      },
      body: JSON.stringify(initialConfig),
    });
    const badPostRes = await postAdminConfig(badPostReq);
    expect(badPostRes.status).toBe(401);

    // POST Authorized test with valid passphrase
    const goodPostReq = new NextRequest("http://localhost:3000/api/admin/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-passphrase": "abuja-resilience-2025",
      },
      body: JSON.stringify(initialConfig),
    });
    const goodPostRes = await postAdminConfig(goodPostReq);
    expect(goodPostRes.status).toBe(200);
    const postData = await goodPostRes.json();
    expect(postData.success).toBe(true);
  });

  // 6. On-Demand Edge Revalidation Test
  it("Matrix 7: /api/revalidate validates secret and executes revalidation", async () => {
    // Bad Secret
    const badReq = new NextRequest("http://localhost:3000/api/revalidate?secret=invalid-secret");
    const badRes = await getRevalidate(badReq);
    expect(badRes.status).toBe(401);

    // Good Secret
    const goodReq = new NextRequest("http://localhost:3000/api/revalidate?secret=abuja-resilience-revalidate-2025");
    const goodRes = await getRevalidate(goodReq);
    expect(goodRes.status).toBe(200);
    const resData = await goodRes.json();
    expect(resData.revalidated).toBe(true);
    expect(typeof resData.now).toBe("number");
  });

  // 7. Social Feed Route Test
  it("Social Feed API: returns valid cached social feed items", async () => {
    const feedRes = await getSocialFeed();
    expect(feedRes.status).toBe(200);
    const feedData = await feedRes.json();
    expect(Array.isArray(feedData.items)).toBe(true);
    expect(feedData.items.length).toBeGreaterThanOrEqual(4);
  });

  // 8. Multi-Currency Donation & WhatsApp URI Generation Test
  it("Matrix 8: WhatsApp confirmation URI correctly encodes GTBank transaction details", async () => {
    const config = await loadNGOConfig();
    const phone = config.banking.ngnAccount.whatsappConfirmationPhone.replace(/\D/g, "");
    const orgName = config.organization.tradingName;
    const amount = 50000;
    const ref = "ARI-TEST-REF";

    const msg = `Hello ${orgName}, I have completed a donation transfer of ₦${amount.toLocaleString()} to your GTBank Account (Ref: ${ref}). Please find my transaction receipt attached.`;
    const encoded = encodeURIComponent(msg);
    const waUri = `https://wa.me/${phone}?text=${encoded}`;

    expect(waUri).toContain("wa.me/2348039001234");
    expect(waUri).toContain("Abuja%20Resilience%20Initiative");
    expect(waUri).toContain("50%2C000");
  });
});
