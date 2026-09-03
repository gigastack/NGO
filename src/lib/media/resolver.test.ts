import { describe, it, expect } from "bun:test";
import { resolveMediaUrl, getMediaDimensions } from "./resolver";
import type { NGOConfig } from "@/lib/schema/ngo.schema";

describe("Media Resolver", () => {
  it("should return external URLs as-is", () => {
    expect(resolveMediaUrl("https://example.com/image.jpg")).toBe("https://example.com/image.jpg");
    expect(resolveMediaUrl("http://cdn.org/video.mp4")).toBe("http://cdn.org/video.mp4");
  });

  it("should resolve local media paths correctly", () => {
    expect(resolveMediaUrl("hero.jpg")).toBe("/media/hero.jpg");
    expect(resolveMediaUrl("/hero.jpg")).toBe("/media/hero.jpg");
    expect(resolveMediaUrl("/media/hero.jpg")).toBe("/media/hero.jpg");
    expect(resolveMediaUrl("media/hero.jpg")).toBe("/media/hero.jpg");
  });

  it("should format Cloudinary URLs with transformations", () => {
    const mockConfig = {
      media: {
        storage: {
          provider: "cloudinary",
          cloudinary: {
            cloudName: "demo-cloud",
            folder: "portal-assets",
            secure: true,
          },
        },
      },
    } as unknown as NGOConfig;

    const url = resolveMediaUrl("sample.jpg", { width: 800, height: 600, quality: 80, format: "webp" }, mockConfig);
    expect(url).toBe("https://res.cloudinary.com/demo-cloud/image/upload/w_800,h_600,q_80,f_webp/portal-assets/sample.jpg");
  });

  it("should gracefully fall back to local when Cloudinary cloudName is empty", () => {
    const mockConfig = {
      media: {
        storage: {
          provider: "cloudinary",
          cloudinary: {
            cloudName: "",
            folder: "portal-assets",
            secure: true,
          },
        },
      },
    } as unknown as NGOConfig;

    const url = resolveMediaUrl("sample.jpg", { width: 800 }, mockConfig);
    expect(url).toBe("/media/sample.jpg");
  });

  it("should format S3 URLs correctly", () => {
    const mockConfig = {
      media: {
        storage: {
          provider: "s3",
          s3: {
            bucket: "my-bucket",
            region: "eu-west-1",
          },
        },
      },
    } as unknown as NGOConfig;

    expect(resolveMediaUrl("photos/monolith.jpg", undefined, mockConfig)).toBe(
      "https://my-bucket.s3.eu-west-1.amazonaws.com/photos/monolith.jpg"
    );
  });

  it("should format S3 with publicUrlBase correctly", () => {
    const mockConfig = {
      media: {
        storage: {
          provider: "s3",
          s3: {
            bucket: "my-bucket",
            region: "eu-west-1",
            publicUrlBase: "https://cdn.resilience.ng",
          },
        },
      },
    } as unknown as NGOConfig;

    expect(resolveMediaUrl("photos/monolith.jpg", undefined, mockConfig)).toBe(
      "https://cdn.resilience.ng/photos/monolith.jpg"
    );
  });

  it("should return correct dimensions for aspect ratios", () => {
    expect(getMediaDimensions("16:9")).toEqual({ width: 1920, height: 1080 });
    expect(getMediaDimensions("4:3")).toEqual({ width: 1440, height: 1080 });
    expect(getMediaDimensions("1:1")).toEqual({ width: 1080, height: 1080 });
  });
});
