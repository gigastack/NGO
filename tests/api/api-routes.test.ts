import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { NextRequest } from "next/server";
import { loadNGOConfig, clearNGOConfigCache, writeNGOConfig } from "@/lib/config-loader";
import { NGOConfigSchema } from "@/lib/schema/ngo.schema";
import { GET as getAdminConfig, POST as postAdminConfig } from "@/app/api/admin/config/route";
import { GET as getRevalidate, POST as postRevalidate } from "@/app/api/revalidate/route";
import { GET as getSocialFeed } from "@/app/api/social-feed/route";
import type { NGOConfig } from "@/lib/schema/ngo.schema";

const VALID_PASSPHRASE = "abuja-resilience-2025";
const VALID_REVALIDATE_SECRET = "abuja-resilience-revalidate-2025";

describe("Programmatic API E2E Verification Suite", () => {
  let originalConfig: NGOConfig;

  beforeEach(() => {
    clearNGOConfigCache();
    originalConfig = loadNGOConfig();
  });

  afterEach(async () => {
    clearNGOConfigCache();
    // Ensure original config is restored
    try {
      await writeNGOConfig(originalConfig);
    } catch {
      // Ignore if already clean
    }
  });

  // -------------------------------------------------------------------------
  // 2.1 Admin Configuration Service (/api/admin/config)
  // -------------------------------------------------------------------------
  describe("2.1 Admin Configuration Service (/api/admin/config)", () => {
    it("GET /api/admin/config returns HTTP 200 with full NGOConfig and Cache-Control headers", async () => {
      const response = await getAdminConfig();
      expect(response.status).toBe(200);

      const cacheControl = response.headers.get("Cache-Control");
      expect(cacheControl).toContain("no-store");
      expect(cacheControl).toContain("max-age=0");

      const body = await response.json();
      const parseResult = NGOConfigSchema.safeParse(body);
      expect(parseResult.success).toBe(true);

      // Verify essential root sections
      expect(body.organization).toBeDefined();
      expect(body.branding).toBeDefined();
      expect(body.governance).toBeDefined();
      expect(body.banking).toBeDefined();
      expect(body.media).toBeDefined();
      expect(body.socialFeed).toBeDefined();
      expect(body.councils).toBeDefined();
    });

    it("POST /api/admin/config rejects unauthenticated requests with HTTP 401", async () => {
      // 1. No credentials
      const reqNoAuth = new NextRequest("http://127.0.0.1:3000/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(originalConfig),
      });
      const resNoAuth = await postAdminConfig(reqNoAuth);
      expect(resNoAuth.status).toBe(401);
      const jsonNoAuth = await resNoAuth.json();
      expect(jsonNoAuth.success).toBe(false);
      expect(jsonNoAuth.message).toBe("Unauthorized: Invalid administrative passphrase.");

      // 2. Invalid header x-admin-passphrase: wrong-key
      const reqBadHeader = new NextRequest("http://127.0.0.1:3000/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passphrase": "wrong-key",
        },
        body: JSON.stringify(originalConfig),
      });
      const resBadHeader = await postAdminConfig(reqBadHeader);
      expect(resBadHeader.status).toBe(401);

      // 3. Invalid Bearer token
      const reqBadBearer = new NextRequest("http://127.0.0.1:3000/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer wrong-key",
        },
        body: JSON.stringify(originalConfig),
      });
      const resBadBearer = await postAdminConfig(reqBadBearer);
      expect(resBadBearer.status).toBe(401);
    });

    it("POST /api/admin/config accepts valid authentication via header and bearer token", async () => {
      // 1. Valid header
      const reqValidHeader = new NextRequest("http://127.0.0.1:3000/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passphrase": VALID_PASSPHRASE,
        },
        body: JSON.stringify(originalConfig),
      });
      const resValidHeader = await postAdminConfig(reqValidHeader);
      expect(resValidHeader.status).toBe(200);

      // 2. Valid Bearer
      const reqValidBearer = new NextRequest("http://127.0.0.1:3000/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${VALID_PASSPHRASE}`,
        },
        body: JSON.stringify(originalConfig),
      });
      const resValidBearer = await postAdminConfig(reqValidBearer);
      expect(resValidBearer.status).toBe(200);
    });

    it("POST /api/admin/config enforces schema guardrails with HTTP 400", async () => {
      // 1. Invalid 5-digit account number
      const corruptedAccountPayload = structuredClone(originalConfig);
      corruptedAccountPayload.banking.ngnAccount.accountNumber = "12345";

      const reqBadAccount = new NextRequest("http://127.0.0.1:3000/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passphrase": VALID_PASSPHRASE,
        },
        body: JSON.stringify(corruptedAccountPayload),
      });
      const resBadAccount = await postAdminConfig(reqBadAccount);
      expect(resBadAccount.status).toBe(400);
      const jsonBadAccount = await resBadAccount.json();
      expect(jsonBadAccount.success).toBe(false);
      const hasAccountIssue = jsonBadAccount.issues?.some((i: { path: (string | number)[] }) =>
        i.path.join(".").includes("banking.ngnAccount.accountNumber")
      );
      expect(hasAccountIssue).toBe(true);

      // 2. Missing Area Council (e.g. amac omitted)
      const missingCouncilPayload = structuredClone(originalConfig);
      delete (missingCouncilPayload.councils as Record<string, unknown>).amac;

      const reqMissingCouncil = new NextRequest("http://127.0.0.1:3000/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passphrase": VALID_PASSPHRASE,
        },
        body: JSON.stringify(missingCouncilPayload),
      });
      const resMissingCouncil = await postAdminConfig(reqMissingCouncil);
      expect(resMissingCouncil.status).toBe(400);

      // 3. Invalid allocation percentages (sum != 100)
      const badAllocationPayload = structuredClone(originalConfig);
      badAllocationPayload.governance.financialAllocation.programsPercent = 70;
      badAllocationPayload.governance.financialAllocation.logisticsPercent = 10;
      badAllocationPayload.governance.financialAllocation.governancePercent = 10; // sum = 90

      const reqBadAlloc = new NextRequest("http://127.0.0.1:3000/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passphrase": VALID_PASSPHRASE,
        },
        body: JSON.stringify(badAllocationPayload),
      });
      const resBadAlloc = await postAdminConfig(reqBadAlloc);
      expect(resBadAlloc.status).toBe(400);
    });

    it("POST /api/admin/config atomically persists and enables immediate round-trip read", async () => {
      const updatedTagline = "Grassroots Power in Abuja";
      const updatedConfig = structuredClone(originalConfig);
      updatedConfig.organization.tagline = updatedTagline;

      // 1. Persist via valid POST
      const postReq = new NextRequest("http://127.0.0.1:3000/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passphrase": VALID_PASSPHRASE,
        },
        body: JSON.stringify(updatedConfig),
      });
      const postRes = await postAdminConfig(postReq);
      expect(postRes.status).toBe(200);

      // 2. Immediately query GET /api/admin/config and verify updated value without restart
      const getRes = await getAdminConfig();
      expect(getRes.status).toBe(200);
      const getBody = await getRes.json();
      expect(getBody.organization.tagline).toBe(updatedTagline);

      // 3. Restore original tagline "From Granite to Grassroots"
      const restoreConfig = structuredClone(originalConfig);
      restoreConfig.organization.tagline = "From Granite to Grassroots";
      const restoreReq = new NextRequest("http://127.0.0.1:3000/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passphrase": VALID_PASSPHRASE,
        },
        body: JSON.stringify(restoreConfig),
      });
      const restoreRes = await postAdminConfig(restoreReq);
      expect(restoreRes.status).toBe(200);

      const finalGet = await getAdminConfig();
      const finalBody = await finalGet.json();
      expect(finalBody.organization.tagline).toBe("From Granite to Grassroots");
    });

    it("POST /api/admin/config supports Vercel read-only filesystem contingency without crashing", async () => {
      const prevVercel = process.env.VERCEL;
      try {
        process.env.VERCEL = "1";
        const req = new NextRequest("http://127.0.0.1:3000/api/admin/config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-passphrase": VALID_PASSPHRASE,
          },
          body: JSON.stringify(originalConfig),
        });
        const res = await postAdminConfig(req);
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.success).toBe(true);
        expect(json.readOnly).toBe(true);
        expect(json.message).toContain("Vercel deployment environment detected");
      } finally {
        if (prevVercel !== undefined) {
          process.env.VERCEL = prevVercel;
        } else {
          delete process.env.VERCEL;
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // 2.2 On-Demand Edge Cache Revalidation Service (/api/revalidate)
  // -------------------------------------------------------------------------
  describe("2.2 On-Demand Edge Cache Revalidation Service (/api/revalidate)", () => {
    it("Rejects unauthorized revalidation requests with HTTP 401", async () => {
      // 1. GET with no query or token
      const reqNoSecret = new NextRequest("http://127.0.0.1:3000/api/revalidate", {
        method: "GET",
      });
      const resNoSecret = await getRevalidate(reqNoSecret);
      expect(resNoSecret.status).toBe(401);
      const jsonNoSecret = await resNoSecret.json();
      expect(jsonNoSecret.revalidated).toBe(false);
      expect(jsonNoSecret.message).toBe("Invalid secret token");

      // 2. GET with invalid secret
      const reqBadSecret = new NextRequest(
        "http://127.0.0.1:3000/api/revalidate?secret=invalid-token",
        { method: "GET" }
      );
      const resBadSecret = await getRevalidate(reqBadSecret);
      expect(resBadSecret.status).toBe(401);

      // 3. POST with bad Bearer token
      const reqBadBearer = new NextRequest("http://127.0.0.1:3000/api/revalidate", {
        method: "POST",
        headers: {
          Authorization: "Bearer wrong-token",
        },
      });
      const resBadBearer = await postRevalidate(reqBadBearer);
      expect(resBadBearer.status).toBe(401);
    });

    it("Accepts authorized revalidation requests with HTTP 200", async () => {
      // 1. GET with ?secret=...
      const reqValidGet = new NextRequest(
        `http://127.0.0.1:3000/api/revalidate?secret=${VALID_REVALIDATE_SECRET}`,
        { method: "GET" }
      );
      const resValidGet = await getRevalidate(reqValidGet);
      expect(resValidGet.status).toBe(200);
      const jsonValidGet = await resValidGet.json();
      expect(jsonValidGet.revalidated).toBe(true);
      expect(typeof jsonValidGet.now).toBe("number");

      // 2. POST with Authorization: Bearer ...
      const reqValidPost = new NextRequest("http://127.0.0.1:3000/api/revalidate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${VALID_REVALIDATE_SECRET}`,
        },
      });
      const resValidPost = await postRevalidate(reqValidPost);
      expect(resValidPost.status).toBe(200);
      const jsonValidPost = await resValidPost.json();
      expect(jsonValidPost.revalidated).toBe(true);
      expect(typeof jsonValidPost.now).toBe("number");
    });
  });

  // -------------------------------------------------------------------------
  // 2.3 Resilient Social Feed Service (/api/social-feed)
  // -------------------------------------------------------------------------
  describe("2.3 Resilient Social Feed Service (/api/social-feed)", () => {
    it("Returns HTTP 200 with items array, timestamp, and correct Cache-Control header", async () => {
      const response = await getSocialFeed();
      expect(response.status).toBe(200);

      const cacheControl = response.headers.get("Cache-Control");
      expect(cacheControl).toBe("s-maxage=300, stale-while-revalidate=600");

      const body = await response.json();
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.cachedAt).toBeDefined();
      expect(new Date(body.cachedAt).getTime()).not.toBeNaN();

      // Minimum 4 dispatches
      expect(body.items.length).toBeGreaterThanOrEqual(4);

      // Verify platforms represented
      const platforms = body.items.map((i: { platform: string }) => i.platform);
      expect(platforms).toContain("x");
      expect(platforms).toContain("instagram");
      expect(platforms).toContain("linkedin");
      expect(platforms).toContain("youtube");

      // Verify every item possesses non-empty content, authorName, and permalink
      for (const item of body.items) {
        expect(typeof item.content).toBe("string");
        expect(item.content.trim().length).toBeGreaterThan(0);
        expect(typeof item.authorName).toBe("string");
        expect(item.authorName.trim().length).toBeGreaterThan(0);
        expect(typeof item.permalink).toBe("string");
        expect(item.permalink.startsWith("http")).toBe(true);
      }
    });
  });
});
