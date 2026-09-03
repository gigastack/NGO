import fs from "node:fs";
import path from "node:path";
import {
  NGOConfigSchema,
  type NGOConfig,
  type Organization,
  type Branding,
  type Governance,
  type Banking,
  type Media,
  type SocialFeedItem,
  type FCTAreaCouncilData,
  type FCTAreaCouncilId,
  FCTAreaCouncilIdSchema,
} from "./schema/ngo.schema";

// Cached config singleton in memory
let cachedConfig: NGOConfig | null = null;

const COUNCIL_IDS: FCTAreaCouncilId[] = [
  "amac",
  "bwari",
  "gwagwalada",
  "kuje",
  "kwali",
  "abaji",
];

/**
 * Resolve the absolute path to the content directory.
 * Works both in standard Node runtime and Next.js server runtime.
 */
function getContentDirectory(): string {
  const cwd = process.cwd();
  const directPath = path.join(cwd, "content");
  if (fs.existsSync(directPath)) {
    return directPath;
  }
  // Fallback checking relative to current working directory
  return path.resolve(cwd, "content");
}

/**
 * Read and JSON.parse a file safely, throwing detailed errors if missing or malformed.
 */
function readJsonFile<T>(filePath: string): T {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Content configuration file missing at: ${filePath}`);
  }
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(rawContent) as T;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to read or parse JSON file at ${filePath}: ${message}`);
  }
}

/**
 * Deep merge environment variable overrides into the raw configuration object.
 *
 * Supported environment variables:
 * - NEXT_PUBLIC_NGO_NAME -> organization.tradingName
 * - NEXT_PUBLIC_NGO_LEGAL_NAME -> organization.legalName
 * - NEXT_PUBLIC_NGO_WHATSAPP -> organization.whatsappNumber AND banking.ngnAccount.whatsappConfirmationPhone
 * - MEDIA_STORAGE_PROVIDER -> media.storage.provider
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME -> media.storage.cloudinary.cloudName
 * - LOCAL_MEDIA_BASE_PATH -> media.storage.local.basePath
 * - S3_BUCKET_NAME -> media.storage.s3.bucket
 */
function applyEnvironmentOverrides(config: {
  organization: Organization;
  branding: Branding;
  governance: Governance;
  banking: Banking;
  media: Media;
  socialFeed: SocialFeedItem[];
  councils: Record<FCTAreaCouncilId, FCTAreaCouncilData>;
}): void {
  const env = process.env;

  // Organization Overrides
  if (env.NEXT_PUBLIC_NGO_NAME?.trim()) {
    config.organization.tradingName = env.NEXT_PUBLIC_NGO_NAME.trim();
  }
  if (env.NEXT_PUBLIC_NGO_LEGAL_NAME?.trim()) {
    config.organization.legalName = env.NEXT_PUBLIC_NGO_LEGAL_NAME.trim();
  }
  if (env.NEXT_PUBLIC_NGO_WHATSAPP?.trim()) {
    const whatsapp = env.NEXT_PUBLIC_NGO_WHATSAPP.trim();
    config.organization.whatsappNumber = whatsapp;
    if (config.banking?.ngnAccount) {
      config.banking.ngnAccount.whatsappConfirmationPhone = whatsapp;
    }
  }

  // Media Storage Overrides
  if (env.MEDIA_STORAGE_PROVIDER?.trim()) {
    const provider = env.MEDIA_STORAGE_PROVIDER.trim() as Media["storage"]["provider"];
    config.media.storage.provider = provider;
  }

  if (env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim()) {
    const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.trim();
    if (!config.media.storage.cloudinary) {
      config.media.storage.cloudinary = {
        cloudName,
        folder: "portal-assets",
        secure: true,
      };
    } else {
      config.media.storage.cloudinary.cloudName = cloudName;
    }
  }

  if (env.LOCAL_MEDIA_BASE_PATH?.trim()) {
    const basePath = env.LOCAL_MEDIA_BASE_PATH.trim();
    if (!config.media.storage.local) {
      config.media.storage.local = {
        basePath,
      };
    } else {
      config.media.storage.local.basePath = basePath;
    }
  }

  if (env.S3_BUCKET_NAME?.trim()) {
    const bucket = env.S3_BUCKET_NAME.trim();
    if (!config.media.storage.s3) {
      config.media.storage.s3 = {
        bucket,
        region: "eu-west-1",
      };
    } else {
      config.media.storage.s3.bucket = bucket;
    }
  }
}

/**
 * Read and assemble all modular content files, apply environment variable overrides,
 * and validate the resulting configuration against NGOConfigSchema.
 */
export function loadNGOConfig(): NGOConfig {
  const contentDir = getContentDirectory();
  const councilsDir = path.join(contentDir, "councils");

  // Read modular files
  const organization = readJsonFile<Organization>(path.join(contentDir, "organization.json"));
  const branding = readJsonFile<Branding>(path.join(contentDir, "branding.json"));
  const governance = readJsonFile<Governance>(path.join(contentDir, "governance.json"));
  const banking = readJsonFile<Banking>(path.join(contentDir, "banking.json"));
  const media = readJsonFile<Media>(path.join(contentDir, "media.json"));
  const socialFeed = readJsonFile<SocialFeedItem[]>(path.join(contentDir, "social-feed.json"));

  // Read councils
  const councils: Record<string, FCTAreaCouncilData> = {};
  for (const councilId of COUNCIL_IDS) {
    const councilFilePath = path.join(councilsDir, `${councilId}.json`);
    councils[councilId] = readJsonFile<FCTAreaCouncilData>(councilFilePath);
  }

  const rawConfig = {
    organization,
    branding,
    governance,
    banking,
    media,
    socialFeed,
    councils: councils as Record<FCTAreaCouncilId, FCTAreaCouncilData>,
  };

  // Apply environment overrides
  applyEnvironmentOverrides(rawConfig);

  // Validate schema
  const parseResult = NGOConfigSchema.safeParse(rawConfig);
  if (!parseResult.success) {
    const formattedErrors = parseResult.error.issues
      .map((issue) => `  - [${issue.path.join(".")}]: ${issue.message}`)
      .join("\n");
    throw new Error(
      `NGO Configuration validation failed against schema:\n${formattedErrors}`
    );
  }

  cachedConfig = parseResult.data;
  return cachedConfig;
}

/**
 * Returns the cached NGOConfig if available; otherwise loads and caches it.
 */
export function getCachedNGOConfig(): NGOConfig {
  if (cachedConfig) {
    return cachedConfig;
  }
  return loadNGOConfig();
}

/**
 * Clears the in-memory cached configuration.
 */
export function clearNGOConfigCache(): void {
  cachedConfig = null;
}

/**
 * Write updated NGOConfig back to the modular content JSON files in `content/` and `content/councils/`.
 * Clears the in-memory cache upon successful write so subsequent reads fetch the latest data.
 *
 * @param updatedConfig The validated or updated NGOConfig to persist.
 */
export async function writeNGOConfig(updatedConfig: NGOConfig): Promise<void> {
  // Validate before writing to avoid corrupting storage
  const parseResult = NGOConfigSchema.safeParse(updatedConfig);
  if (!parseResult.success) {
    const formattedErrors = parseResult.error.issues
      .map((issue) => `  - [${issue.path.join(".")}]: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Cannot persist invalid NGO Configuration:\n${formattedErrors}`
    );
  }

  const validConfig = parseResult.data;
  const contentDir = getContentDirectory();
  const councilsDir = path.join(contentDir, "councils");

  // Ensure directories exist
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  if (!fs.existsSync(councilsDir)) {
    fs.mkdirSync(councilsDir, { recursive: true });
  }

  // 1. Write modular root files
  const modularFiles: Array<{ filename: string; data: unknown }> = [
    { filename: "organization.json", data: validConfig.organization },
    { filename: "branding.json", data: validConfig.branding },
    { filename: "governance.json", data: validConfig.governance },
    { filename: "banking.json", data: validConfig.banking },
    { filename: "media.json", data: validConfig.media },
    { filename: "social-feed.json", data: validConfig.socialFeed },
  ];

  for (const { filename, data } of modularFiles) {
    const targetPath = path.join(contentDir, filename);
    await fs.promises.writeFile(targetPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
  }

  // 2. Write council files
  for (const councilId of COUNCIL_IDS) {
    const councilData = validConfig.councils[councilId];
    if (councilData) {
      const councilPath = path.join(councilsDir, `${councilId}.json`);
      await fs.promises.writeFile(
        councilPath,
        JSON.stringify(councilData, null, 2) + "\n",
        "utf-8"
      );
    }
  }

  // Invalidate in-memory cache
  clearNGOConfigCache();
}

// Re-export Schema and Types for convenience
export * from "./schema/ngo.schema";
