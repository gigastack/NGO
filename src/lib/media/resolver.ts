import type { NGOConfig } from "@/lib/schema/ngo.schema";

export interface MediaTransformOptions {
  width?: number;
  height?: number;
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif" | "mp4" | "webm";
  video?: boolean;
}

/**
 * Aspect ratio helper returning standard width and height definitions
 */
export function getMediaDimensions(
  aspectRatio: "16:9" | "4:3" | "1:1"
): { width: number; height: number } {
  switch (aspectRatio) {
    case "16:9":
      return { width: 1920, height: 1080 };
    case "4:3":
      return { width: 1440, height: 1080 };
    case "1:1":
      return { width: 1080, height: 1080 };
    default: {
      const _exhaustiveCheck: never = aspectRatio;
      return { width: 1920, height: 1080 };
    }
  }
}

/**
 * Normalizes leading slashes and paths for clean concatenation
 */
function cleanMediaPath(path: string): string {
  // Strip leading slashes
  let cleaned = path.trim().replace(/^\/+/, "");
  return cleaned;
}

/**
 * Default fallback configuration when overrideConfig is not provided
 */
const defaultFallbackConfig: {
  media: {
    storage: {
      provider: "local" | "cloudinary" | "s3" | "external";
      local?: { basePath: string };
      cloudinary?: { cloudName: string; folder: string; secure: boolean };
      s3?: { bucket: string; region: string; endpoint?: string; publicUrlBase?: string };
    };
  };
} = {
  media: {
    storage: {
      provider: "local",
      local: {
        basePath: "/media",
      },
    },
  },
};

/**
 * Resolves any media asset path, ID, or external URL into a production-ready CDN/Local URL.
 *
 * Provider Strategy:
 * 1. Absolute URLs (http:// or https://) returned as-is.
 * 2. Cloudinary: https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transforms}/${cleanPath}
 *    If cloudName is missing or empty, gracefully falls back to /media/${cleanPath}.
 * 3. S3 / R2 / MinIO: ${publicUrlBase || `https://${bucket}.s3.${region}.amazonaws.com`}/${cleanPath}
 * 4. Local: ${basePath}/${cleanPath} (default basePath '/media', normalizing slashes).
 */
export function resolveMediaUrl(
  pathOrId: string,
  options?: MediaTransformOptions,
  overrideConfig?: NGOConfig
): string {
  if (!pathOrId) {
    return "";
  }

  const trimmed = pathOrId.trim();

  // If pathOrId starts with http:// or https://, return as-is
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const mediaStorage = overrideConfig?.media?.storage || defaultFallbackConfig.media.storage;
  const provider = mediaStorage.provider;
  const cleanPath = cleanMediaPath(trimmed);

  // Cloudinary Provider
  if (provider === "cloudinary") {
    const cloudinaryConfig = mediaStorage.cloudinary;
    const cloudName = cloudinaryConfig?.cloudName?.trim();

    // Fall back to local if cloudName is missing or empty so rendering never breaks
    if (!cloudName) {
      return `/media/${cleanPath}`;
    }

    const resourceType = options?.video ? "video" : "image";
    const transforms: string[] = [];

    if (options?.width) {
      transforms.push(`w_${options.width}`);
    }
    if (options?.height) {
      transforms.push(`h_${options.height}`);
    }
    if (options?.quality !== undefined) {
      transforms.push(`q_${options.quality}`);
    }
    if (options?.format) {
      transforms.push(`f_${options.format}`);
    }

    const transformSegment = transforms.length > 0 ? `${transforms.join(",")}/` : "";
    const folder = cloudinaryConfig?.folder ? `${cleanMediaPath(cloudinaryConfig.folder)}/` : "";

    // If cleanPath already includes the folder prefix, don't duplicate
    const finalPath = folder && cleanPath.startsWith(folder) ? cleanPath : `${folder}${cleanPath}`;

    return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformSegment}${finalPath}`;
  }

  // S3 / R2 / MinIO Provider
  if (provider === "s3") {
    const s3Config = mediaStorage.s3;
    if (s3Config?.publicUrlBase) {
      const base = s3Config.publicUrlBase.replace(/\/+$/, "");
      return `${base}/${cleanPath}`;
    }

    const bucket = s3Config?.bucket || "abuja-ngo-portal";
    const region = s3Config?.region || "af-south-1";

    if (s3Config?.endpoint) {
      const endpoint = s3Config.endpoint.replace(/\/+$/, "");
      return `${endpoint}/${bucket}/${cleanPath}`;
    }

    return `https://${bucket}.s3.${region}.amazonaws.com/${cleanPath}`;
  }

  // Local / External / Default Provider
  const localBasePath = (mediaStorage.local?.basePath || "/media").trim();
  const normalizedBasePath = localBasePath.startsWith("/")
    ? localBasePath.replace(/\/+$/, "")
    : `/${localBasePath.replace(/\/+$/, "")}`;

  // If cleanPath already starts with 'media/' and basePath is '/media', avoid duplicating '/media/media/...'
  if (normalizedBasePath === "/media" && cleanPath.startsWith("media/")) {
    return `/${cleanPath}`;
  }

  return `${normalizedBasePath}/${cleanPath}`;
}
