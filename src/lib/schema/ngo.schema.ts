import { z } from "zod";

// 1. FCT Area Councils
export const FCTAreaCouncilIdSchema = z.enum([
  "amac",
  "bwari",
  "gwagwalada",
  "kuje",
  "kwali",
  "abaji",
]);
export type FCTAreaCouncilId = z.infer<typeof FCTAreaCouncilIdSchema>;

// 2. Media Storage Configuration
export const MediaStorageProviderSchema = z.enum([
  "cloudinary",
  "s3",
  "local",
  "external",
]);
export type MediaStorageProvider = z.infer<typeof MediaStorageProviderSchema>;

export const CloudinaryConfigSchema = z.object({
  cloudName: z.string(),
  folder: z.string().default("portal-assets"),
  secure: z.boolean().default(true),
});
export type CloudinaryConfig = z.infer<typeof CloudinaryConfigSchema>;

export const S3ConfigSchema = z.object({
  bucket: z.string(),
  region: z.string(),
  endpoint: z.string().optional(),
  publicUrlBase: z.string().optional(),
});
export type S3Config = z.infer<typeof S3ConfigSchema>;

export const LocalStorageConfigSchema = z.object({
  basePath: z.string().default("/media"),
});
export type LocalStorageConfig = z.infer<typeof LocalStorageConfigSchema>;

export const MediaStorageSchema = z.object({
  provider: MediaStorageProviderSchema,
  cloudinary: CloudinaryConfigSchema.optional(),
  s3: S3ConfigSchema.optional(),
  local: LocalStorageConfigSchema.optional(),
});
export type MediaStorage = z.infer<typeof MediaStorageSchema>;

// Mini-documentaries and general media items
export const MiniDocumentarySchema = z.object({
  id: z.string(),
  title: z.string(),
  councilId: FCTAreaCouncilIdSchema,
  mediaPath: z.string(),
  durationMinutes: z.number().positive(),
  thumbnailPath: z.string(),
  captionSummary: z.string(),
});
export type MiniDocumentary = z.infer<typeof MiniDocumentarySchema>;

export const MediaItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  thumbnailUrl: z.string().optional(),
  type: z.enum(["image", "video", "audio", "document"]),
  caption: z.string().optional(),
});
export type MediaItem = z.infer<typeof MediaItemSchema>;

export const MediaSchema = z.object({
  storage: MediaStorageSchema,
  heroBackgroundVideo: z.string(),
  heroFallbackPoster: z.string(),
  ambientAudioSoundscapeUrl: z.string().optional(),
  miniDocumentaries: z.array(MiniDocumentarySchema),
});
export type Media = z.infer<typeof MediaSchema>;

// 3. Organization Schema
export const OrganizationSchema = z.object({
  legalName: z.string(),
  tradingName: z.string(),
  acronym: z.string(),
  tagline: z.string(),
  mission: z.string(),
  vision: z.string(),
  foundingYear: z.number().int().min(1900).max(2100),
  headquartersAddress: z.string(),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid phone number format"),
  whatsappNumber: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid WhatsApp number format"),
});
export type Organization = z.infer<typeof OrganizationSchema>;

// 4. Branding Schema
export const BrandingSchema = z.object({
  logoUrl: z.string(),
  logoAlt: z.string(),
  crestSvgPath: z.string().optional(),
  faviconUrl: z.string(),
  primaryColorHex: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color"),
  themeMode: z.enum(["light", "dark", "system"]),
});
export type Branding = z.infer<typeof BrandingSchema>;

// 5. Governance Schema
export const TrusteeSchema = z.object({
  name: z.string(),
  role: z.string(),
  qualification: z.string(),
  bio: z.string(),
  avatarUrl: z.string().optional(),
});
export type Trustee = z.infer<typeof TrusteeSchema>;

export const FinancialAllocationSchema = z.object({
  programsPercent: z.number().min(0).max(100),
  logisticsPercent: z.number().min(0).max(100),
  governancePercent: z.number().min(0).max(100),
}).refine(
  (data) => data.programsPercent + data.logisticsPercent + data.governancePercent === 100,
  { message: "Allocation percentages must sum to 100%" }
);
export type FinancialAllocation = z.infer<typeof FinancialAllocationSchema>;

export const GovernanceSchema = z.object({
  cacNumber: z.string().regex(/^CAC\/IT\/NO\/\d+$|^CAC\/[A-Z0-9\/-]+$/, "Invalid CAC registration format"),
  scumlNumber: z.string().regex(/^SCUML-[A-Z0-9:\s\/-]+$/, "Invalid SCUML certificate number format"),
  firsTin: z.string().regex(/^\d{8}-\d{4}$|^\d{10,12}$/, "Invalid FIRS Tax Identification Number format"),
  taxExemptionCitation: z.string(),
  incorporationDate: z.string(),
  trustees: z.array(TrusteeSchema).min(1),
  auditedFinancialYear: z.string(),
  financialAllocation: FinancialAllocationSchema,
  annualReportPdfUrl: z.string(),
});
export type Governance = z.infer<typeof GovernanceSchema>;

// 6. Banking & Donations
export const NgnAccountSchema = z.object({
  bankName: z.string(),
  accountName: z.string(),
  accountNumber: z.string().regex(/^\d{10}$/, "NGN Account Number must be exactly 10 digits"),
  sortCode: z.string().optional(),
  whatsappConfirmationPhone: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid WhatsApp confirmation phone number"),
});
export type NgnAccount = z.infer<typeof NgnAccountSchema>;

export const DomiciliaryAccountSchema = z.object({
  currency: z.enum(["USD", "EUR", "GBP"]),
  bankName: z.string(),
  accountName: z.string(),
  accountNumber: z.string(),
  swiftBic: z.string().min(8).max(11),
  routingIban: z.string().optional(),
});
export type DomiciliaryAccount = z.infer<typeof DomiciliaryAccountSchema>;

export const DigitalGatewaysSchema = z.object({
  paystackPublicKey: z.string().optional(),
  flutterwavePublicKey: z.string().optional(),
});
export type DigitalGateways = z.infer<typeof DigitalGatewaysSchema>;

export const DonationTierSchema = z.object({
  id: z.string(),
  amountNgn: z.number().positive(),
  amountUsd: z.number().positive(),
  label: z.string(),
  impactDescription: z.string(),
  visualAssetKey: z.string().optional(),
});
export type DonationTier = z.infer<typeof DonationTierSchema>;

export const BankingSchema = z.object({
  ngnAccount: NgnAccountSchema,
  domiciliaryAccounts: z.array(DomiciliaryAccountSchema),
  digitalGateways: DigitalGatewaysSchema.optional(),
  donationTiers: z.array(DonationTierSchema).min(1),
});
export type Banking = z.infer<typeof BankingSchema>;

// 7. Area Council and Field Projects
export const FCTFieldProjectCategorySchema = z.enum([
  "education",
  "healthcare",
  "agriculture",
  "water_sanitation",
  "idp_resilience",
]);
export type FCTFieldProjectCategory = z.infer<typeof FCTFieldProjectCategorySchema>;

export const FCTFieldProjectStatusSchema = z.enum(["active", "completed", "planned"]);
export type FCTFieldProjectStatus = z.infer<typeof FCTFieldProjectStatusSchema>;

export const FCTFieldProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: FCTFieldProjectCategorySchema,
  settlementName: z.string(),
  settlementType: z.string(),
  beneficiariesCount: z.number().int().nonnegative(),
  status: FCTFieldProjectStatusSchema,
  description: z.string(),
  mediaPath: z.string().optional(),
});
export type FCTFieldProject = z.infer<typeof FCTFieldProjectSchema>;

export const FieldDispatchLeadSchema = z.object({
  name: z.string(),
  role: z.string(),
  phone: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid dispatch lead phone number"),
});
export type FieldDispatchLead = z.infer<typeof FieldDispatchLeadSchema>;

export const FCTAreaCouncilDataSchema = z.object({
  id: FCTAreaCouncilIdSchema,
  name: z.string(),
  headquarters: z.string(),
  terrainType: z.string(),
  populationServed: z.number().int().positive(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  fieldDispatchLead: FieldDispatchLeadSchema,
  activeProjects: z.array(FCTFieldProjectSchema),
});
export type FCTAreaCouncilData = z.infer<typeof FCTAreaCouncilDataSchema>;

// 8. Social Feed
export const SocialPlatformSchema = z.enum(["x", "instagram", "linkedin", "youtube"]);
export type SocialPlatform = z.infer<typeof SocialPlatformSchema>;

export const SocialFeedItemSchema = z.object({
  id: z.string(),
  platform: SocialPlatformSchema,
  authorName: z.string(),
  authorHandle: z.string(),
  content: z.string(),
  timestamp: z.string(),
  mediaUrl: z.string().optional(),
  permalink: z.string(),
  engagement: z.object({
    likes: z.number().int().nonnegative().optional(),
    shares: z.number().int().nonnegative().optional(),
    views: z.number().int().nonnegative().optional(),
  }).optional(),
});
export type SocialFeedItem = z.infer<typeof SocialFeedItemSchema>;

// 9. Root NGO Configuration
export const NGOConfigSchema = z.object({
  organization: OrganizationSchema,
  branding: BrandingSchema,
  governance: GovernanceSchema,
  banking: BankingSchema,
  media: MediaSchema,
  socialFeed: z.array(SocialFeedItemSchema),
  councils: z
    .record(FCTAreaCouncilIdSchema, FCTAreaCouncilDataSchema)
    .refine(
      (councils) => {
        const required: FCTAreaCouncilId[] = [
          "amac",
          "bwari",
          "gwagwalada",
          "kuje",
          "kwali",
          "abaji",
        ];
        return required.every((id) => id in councils && councils[id] !== undefined);
      },
      { message: "All 6 FCT Area Councils (amac, bwari, gwagwalada, kuje, kwali, abaji) must be provided." }
    ),
});
export type NGOConfig = z.infer<typeof NGOConfigSchema>;

// Validation Helper functions
export function validateNGOConfig(data: unknown): NGOConfig {
  return NGOConfigSchema.parse(data);
}

export function safeValidateNGOConfig(data: unknown) {
  return NGOConfigSchema.safeParse(data);
}

export function validateCouncilData(data: unknown): FCTAreaCouncilData {
  return FCTAreaCouncilDataSchema.parse(data);
}

export function safeValidateCouncilData(data: unknown) {
  return FCTAreaCouncilDataSchema.safeParse(data);
}
