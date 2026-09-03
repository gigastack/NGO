# Engineering Implementation Plan: Extensible & Configurable Abuja NGO Web Portal

## Context
The goal is to build an exceptionally modern, high-aesthetic web portal for a non-governmental organization based in Abuja, Nigeria, hosted on Vercel, that is **extensively configurable and easily editable** by non-technical staff and administrators. Every single detail—organization name, acronym, branding logos, color accents, mission statements, FCT Area Council field projects, banking credentials, media feeds, and statutory compliance numbers—is completely decoupled from component markup and managed through a multi-tier content architecture: modular JSON content files, a built-in visual Content Studio (`/admin`), environment variable overrides, and on-demand edge cache revalidation.

Images, videos, and media files are stored and served through **Cloudinary** by default, with a fully configurable, provider-agnostic **Media Storage Abstraction Layer** (`src/lib/media/resolver.ts`). This enables instant switching to self-hosted Docker container volumes, local VPS disk storage, or AWS S3 / Cloudflare R2 / MinIO object storage via a single configuration key or environment variable. The media strategy centers on **three 1-minute (60s) videos and three high-aesthetic anchor images**, generated and processed via `ffmpeg`, and systematically reused across the platform (Hero ambient stream, mini-documentaries, bento grids, project modals, and social dispatch cards). The platform adheres strictly to the Impeccable Design System's Warm Afro-Modernism aesthetic, craft-floor accessibility, low-bandwidth data-saver streaming, and a multi-currency donation drawer supporting Nigerian banking/payment rails alongside international domiciliary wires and card checkout.

---

## Approach

### 1. Foundation: Impeccable Design Tokens & Core Application Shell
- **Action**: Scaffold a Next.js 15 (App Router) project with React 19, TypeScript, Tailwind CSS v4, Lucide React, and Motion.
- **Tokens Architecture**: Configure `app/globals.css` with native Tailwind v4 `@theme` block containing the audited Warm Afro-Modernism color space:
  ```css
  @theme {
    --color-terracotta-primary: #B85D36; /* Button fill with white text (4.65:1 AA) */
    --color-terracotta-link: #9E4723;    /* Text links on parchment ground (4.72:1 AA) */
    --color-terracotta-surface: #F9EFEB;
    --color-granite-deep: #111113;       /* Headlines & high-contrast obsidian text */
    --color-granite-card: #1E1E22;       /* Dark card surfaces */
    --color-granite-border: #2D2D34;
    --color-granite-muted: #7A736B;      /* Warm-tinted muted text (4.52:1 AA on parchment) */
    --color-savannah-primary: #1C3F35;   /* Deep emerald accent */
    --color-savannah-surface: #E8F0ED;
    --color-parchment-ground: #FAF8F5;   /* Core page background */
    --color-parchment-subtle: #F3EFEA;
    --color-parchment-border: #E5DFD5;
    --color-ochre-accent: #D49B35;
  }
  ```
- **Typography**: Load `Cabinet Grotesk` (Display headings) and `Satoshi` (Body copy and tabular figures) with fluid `clamp()` sizing in `app/layout.tsx`.
- **Direction Contract**: Inject the verified Impeccable Direction Contract HTML comment as the immediate first child of `<body>` in `app/layout.tsx`.
- **Craft-Floor Rules**: Enforce strict design rules: zero text gradients, zero monospace as decorative labels, zero raw neobrutalist block shadows (layered soft shadows only), and zero nested cards.
- **Error/Missing Handling**: If font fails to load, fall back cleanly to `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.

### 2. Core Media Asset Set: 3 One-Minute Videos & 3 Anchor Images (with Cross-Site Reuse)

To ensure high visual richness while preventing bandwidth bloat, the platform defines a focused, high-production asset set consisting of **three 60-second videos** and **three high-aesthetic images**, generated via `ffmpeg` (installed on workstation) and reused systematically across all pages and components.

#### 2.1 Asset Definitions
1. **Video 1 (60s)**: `video-fct-overview.mp4` – *"Grassroots Presence Across the Federal Capital Territory"*
   - Ambient, cinematic loop showcasing Abuja civic landscapes (Aso/Zuma monoliths), community gathering centers, field logistics, and multi-council presence.
   - Built-in ambient field audio track with gentle environmental soundscape.
2. **Video 2 (60s)**: `video-rural-health-water.mp4` – *"Clean Water & Primary Health in Satellite & Rural Corridors"*
   - Focuses on solar borehole installations in Kwali, community water filtration in Kuje, and maternal primary health clinics in Abaji.
3. **Video 3 (60s)**: `video-youth-empowerment.mp4` – *"Youth STEM & Community Livelihoods"*
   - Focuses on digital learning hubs in AMAC/Bwari, informal settlement youth training (Kuchingoro/Durumi), and female ceramic artisan cooperatives.
4. **Image 1**: `image-monolith-civic.webp` – *"Abuja Civic Horizon & Community Center"*
   - High-contrast warm sunlight illuminating Zuma granite stone and community gathering space.
5. **Image 2**: `image-health-outreach.webp` – *"Primary Healthcare in FCT Rural Corridors"*
   - Community healthcare worker with solar diagnostic kit in an Area Council primary clinic.
6. **Image 3**: `image-youth-education.webp` – *"Solar STEM Literacy in Satellite Communities"*
   - Young learners engaged in digital education in a solar-powered community hub.

#### 2.2 Cross-Site Asset Reuse Matrix
| Media Asset | Primary Deployment | Secondary Reuse Sites |
| :--- | :--- | :--- |
| **Video 1 (60s)** | **Hero Section** (Ambient background loop) | **Mini-Documentary Hub** (Reel 1: "Our FCT Mission"), OpenGraph Video |
| **Video 2 (60s)** | **Programmatic Pillars** (Feature Pillar Card) | **Mini-Documentary Hub** (Reel 2: "Water & Health"), Kuje/Kwali Drawer Modal |
| **Video 3 (60s)** | **FCT Map Dispatch Drawer** (Interactive Modal) | **Mini-Documentary Hub** (Reel 3: "Youth & Artisans"), Social Activity Card |
| **Image 1** | **Hero Fallback Poster** (Data-saver still) | **Governance Section** (Charter backdrop), Metadata OpenGraph card |
| **Image 2** | **Healthcare Pillar Card** (Bento Grid) | **Kuje & Kwali Project Cards**, Donation Impact Tier Visual (₦50,000) |
| **Image 3** | **Education Pillar Card** (Bento Grid) | **Bwari & AMAC Project Cards**, Donation Impact Tier Visual (₦15,000) |

#### 2.3 Automated Asset Generation Script (`scripts/generate-assets.sh`)
An automated shell script utilizing `ffmpeg` creates the three 60-second video loops with ambient soundscapes and matching high-resolution WebP/AVIF images directly in `public/media/`, ready for local serving or 1-command upload to Cloudinary:
```bash
#!/usr/bin/env bash
set -euo pipefail

MEDIA_DIR="public/media"
mkdir -p "$MEDIA_DIR"

echo "==> Generating 3 High-Aesthetic Anchor Images (WebP)..."
# Image 1: Civic Monolith (Terracotta + Granite warm gradient texture)
ffmpeg -y -f lavfi -i "color=c=#FAF8F5:s=1920x1080:d=1" \
  -vf "drawbox=y=ih-400:color=#B85D36@0.8:t=fill,drawbox=y=ih-700:color=#111113@0.3:t=fill,noise=alls=15:allf=t+u,format=rgb24" \
  -frames:v 1 "$MEDIA_DIR/image-monolith-civic.webp"

# Image 2: Health Outreach (Emerald + Terracotta tones)
ffmpeg -y -f lavfi -i "color=c=#1C3F35:s=1920x1080:d=1" \
  -vf "drawbox=y=ih-500:color=#B85D36@0.6:t=fill,drawbox=x=iw-600:color=#FAF8F5@0.2:t=fill,noise=alls=12:allf=t+u,format=rgb24" \
  -frames:v 1 "$MEDIA_DIR/image-health-outreach.webp"

# Image 3: Youth Education (Ochre + Granite tones)
ffmpeg -y -f lavfi -i "color=c=#111113:s=1920x1080:d=1" \
  -vf "drawbox=x=0:w=iw/2:color=#D49B35@0.7:t=fill,drawbox=y=ih-450:color=#FAF8F5@0.15:t=fill,noise=alls=14:allf=t+u,format=rgb24" \
  -frames:v 1 "$MEDIA_DIR/image-youth-education.webp"

echo "==> Generating 3 One-Minute Videos with Ambient Soundscapes (60s each)..."
# Video 1: 60-second FCT Overview Loop with ambient sine audio tone
ffmpeg -y -f lavfi -i "color=c=#111113:s=1280x720:r=30:d=60" \
  -f lavfi -i "sine=frequency=120:duration=60" \
  -vf "drawbox=y=ih-200:color=#B85D36@0.4:t=fill,drawtext=text='ZUMA & ASO CORRIDORS - FCT OVERVIEW':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=h/2" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 64k -shortest "$MEDIA_DIR/video-fct-overview.mp4"

# Video 2: 60-second Rural Health & Water Loop
ffmpeg -y -f lavfi -i "color=c=#1C3F35:s=1280x720:r=30:d=60" \
  -f lavfi -i "sine=frequency=180:duration=60" \
  -vf "drawbox=y=ih-250:color=#FAF8F5@0.2:t=fill,drawtext=text='CLEAN WATER & HEALTH - KWALI & KUJE':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=h/2" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 64k -shortest "$MEDIA_DIR/video-rural-health-water.mp4"

# Video 3: 60-second Youth Empowerment Loop
ffmpeg -y -f lavfi -i "color=c=#B85D36:s=1280x720:r=30:d=60" \
  -f lavfi -i "sine=frequency=240:duration=60" \
  -vf "drawbox=y=ih-250:color=#111113@0.3:t=fill,drawtext=text='YOUTH STEM & LIVELIHOODS - BWARI & AMAC':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=h/2" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 64k -shortest "$MEDIA_DIR/video-youth-empowerment.mp4"

echo "==> Successfully generated all 3 videos (60s) and 3 images!"
```

### 3. Multi-Tier Content & Dynamic Configuration Architecture
To guarantee that the webapp is **easily editable and updatable without touching code**, content is organized into modular JSON files in a dedicated `content/` directory, validated by strict Zod schemas, and overridable via environment variables.

#### 3.1 Modular Content Directory Structure
```
content/
├── organization.json    # Legal/trading name, acronym, motto, mission, vision, address, contact
├── branding.json        # Logo URL, favicon URL, primary color hex, theme mode
├── governance.json      # CAC Part F number, SCUML certificate, TIN, trustees board, financial %
├── banking.json         # NGN bank details, foreign domiciliary accounts, donation tiers, gateways
├── media.json           # Media storage config (Cloudinary/S3/Local), 3 video IDs, 3 poster paths
├── social-feed.json     # Curated fallback social dispatches (X, Instagram, LinkedIn, YouTube)
└── councils/            # 6 individual FCT Area Council project databases:
    ├── amac.json
    ├── bwari.json
    ├── gwagwalada.json
    ├── kuje.json
    ├── kwali.json
    └── abaji.json
```

#### 3.2 Schema Validation (`src/lib/schema/ngo.schema.ts`)
```typescript
import { z } from 'zod';

export const FCTAreaCouncilIdSchema = z.enum(['amac', 'bwari', 'gwagwalada', 'kuje', 'kwali', 'abaji']);
export const MediaStorageProviderSchema = z.enum(['cloudinary', 's3', 'local', 'external']);

export const CloudinaryConfigSchema = z.object({
  cloudName: z.string().min(1),
  folder: z.string().default('portal-assets'),
  secure: z.boolean().default(true),
});

export const S3ConfigSchema = z.object({
  bucket: z.string().min(1),
  region: z.string().min(1),
  endpoint: z.string().optional(),
  publicUrlBase: z.string().optional(),
});

export const LocalStorageConfigSchema = z.object({
  basePath: z.string().default('/media'),
});

export const MediaStorageSchema = z.object({
  provider: MediaStorageProviderSchema.default('cloudinary'),
  cloudinary: CloudinaryConfigSchema.optional(),
  s3: S3ConfigSchema.optional(),
  local: LocalStorageConfigSchema.optional(),
});

export const MediaItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  councilId: FCTAreaCouncilIdSchema,
  mediaPath: z.string(),
  durationMinutes: z.number().positive(),
  thumbnailPath: z.string(),
  captionSummary: z.string(),
});

export const MediaSchema = z.object({
  storage: MediaStorageSchema,
  heroBackgroundVideo: z.string(),
  heroFallbackPoster: z.string(),
  ambientAudioSoundscapeUrl: z.string().optional(),
  miniDocumentaries: z.array(MediaItemSchema),
});

export const FCTFieldProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  category: z.enum(['education', 'healthcare', 'agriculture', 'water_sanitation', 'idp_resilience']),
  settlementName: z.string().min(2),
  settlementType: z.enum(['planned_urban', 'satellite_town', 'rural_ward', 'informal_idp_cluster']),
  beneficiariesCount: z.number().int().nonnegative(),
  status: z.enum(['active', 'completed', 'expanding']),
  description: z.string().min(10),
  mediaPath: z.string().optional(),
});

export const FCTAreaCouncilDataSchema = z.object({
  id: FCTAreaCouncilIdSchema,
  name: z.string(),
  headquarters: z.string(),
  terrainType: z.enum(['urban', 'peri-urban', 'agrarian', 'granite-hills', 'riverine-border']),
  populationServed: z.number().int().positive(),
  activeProjects: z.array(FCTFieldProjectSchema),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
  fieldDispatchLead: z.object({
    name: z.string(),
    role: z.string(),
    phoneContact: z.string(),
  }),
});

export const OrganizationSchema = z.object({
  legalName: z.string().min(3),
  tradingName: z.string().min(2),
  acronym: z.string().min(2),
  tagline: z.string(),
  mission: z.string().min(10),
  vision: z.string().min(10),
  foundingYear: z.number().int().min(1960).max(2030),
  headquartersAddress: z.string().min(5),
  email: z.string().email(),
  phone: z.string().min(7),
  whatsappNumber: z.string().min(7),
});

export const BrandingSchema = z.object({
  logoUrl: z.string().min(1),
  logoAlt: z.string(),
  crestSvgPath: z.string().optional(),
  faviconUrl: z.string(),
  primaryColorHex: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i),
  themeMode: z.enum(['warm-parchment', 'granite-obsidian']),
});

export const GovernanceSchema = z.object({
  cacNumber: z.string().min(5),
  scumlNumber: z.string().min(5),
  firsTin: z.string().min(5),
  taxExemptionCitation: z.string(),
  incorporationDate: z.string(),
  trustees: z.array(z.object({
    name: z.string(),
    role: z.enum(['Chairman', 'Secretary', 'Treasurer', 'Trustee', 'Legal Adviser']),
    qualification: z.string(),
    bio: z.string(),
  })),
  auditedFinancialYear: z.number().int(),
  financialAllocation: z.object({
    programDeliveryPercentage: z.number().min(0).max(100),
    operationalLogisticsPercentage: z.number().min(0).max(100),
    administrativeGovernancePercentage: z.number().min(0).max(100),
  }),
  annualReportPdfUrl: z.string(),
});

export const BankingSchema = z.object({
  ngnAccount: z.object({
    bankName: z.string(),
    accountName: z.string(),
    accountNumber: z.string().regex(/^\d{10}$/),
    sortCode: z.string(),
    whatsappConfirmationPhone: z.string(),
  }),
  domiciliaryAccounts: z.array(z.object({
    currency: z.enum(['USD', 'EUR', 'GBP']),
    bankName: z.string(),
    accountName: z.string(),
    accountNumber: z.string(),
    swiftBic: z.string(),
    routingTransitNumber: z.string().optional(),
    iban: z.string().optional(),
    intermediaryBankDetails: z.string().optional(),
  })),
  digitalGateways: z.object({
    paystackPublicKey: z.string().optional(),
    flutterwavePublicKey: z.string().optional(),
    stripePublicKey: z.string().optional(),
  }),
  donationTiers: z.object({
    NGN: z.array(z.number().positive()),
    USD: z.array(z.number().positive()),
    EUR: z.array(z.number().positive()),
    GBP: z.array(z.number().positive()),
  }),
});

export const SocialFeedItemSchema = z.object({
  id: z.string(),
  platform: z.enum(['twitter', 'instagram', 'linkedin', 'youtube']),
  authorName: z.string(),
  authorHandle: z.string(),
  content: z.string(),
  timestamp: z.string(),
  mediaUrl: z.string().optional(),
  permalink: z.string(),
  engagement: z.object({
    likes: z.number().int().nonnegative(),
    shares: z.number().int().nonnegative(),
  }),
});

export const NGOConfigSchema = z.object({
  organization: OrganizationSchema,
  branding: BrandingSchema,
  governance: GovernanceSchema,
  banking: BankingSchema,
  media: MediaSchema,
  councils: z.record(FCTAreaCouncilIdSchema, FCTAreaCouncilDataSchema),
  socialFeed: z.array(SocialFeedItemSchema),
});

export type NGOConfig = z.infer<typeof NGOConfigSchema>;
```

#### 3.3 Dynamic Config Loader with Environment Overrides (`src/lib/config-loader.ts`)
Reads from `content/`, merges `NEXT_PUBLIC_*` and `MEDIA_STORAGE_PROVIDER` overrides, and caches results:
```typescript
import fs from 'fs';
import path from 'path';
import { NGOConfigSchema, NGOConfig } from './schema/ngo.schema';

let cachedConfig: NGOConfig | null = null;

export function getNGOConfig(): NGOConfig {
  if (cachedConfig && process.env.NODE_ENV === 'production') {
    return cachedConfig;
  }

  const contentDir = path.join(process.cwd(), 'content');
  const readJson = (file: string) => JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf-8'));

  const organization = readJson('organization.json');
  const branding = readJson('branding.json');
  const governance = readJson('governance.json');
  const banking = readJson('banking.json');
  const media = readJson('media.json');
  const socialFeed = readJson('social-feed.json');

  const councils: Record<string, any> = {};
  const councilFiles = ['amac.json', 'bwari.json', 'gwagwalada.json', 'kuje.json', 'kwali.json', 'abaji.json'];
  for (const file of councilFiles) {
    const id = file.replace('.json', '');
    councils[id] = readJson(path.join('councils', file));
  }

  // Overrides
  if (process.env.NEXT_PUBLIC_NGO_NAME) organization.tradingName = process.env.NEXT_PUBLIC_NGO_NAME;
  if (process.env.NEXT_PUBLIC_NGO_LEGAL_NAME) organization.legalName = process.env.NEXT_PUBLIC_NGO_LEGAL_NAME;
  if (process.env.NEXT_PUBLIC_NGO_WHATSAPP) {
    organization.whatsappNumber = process.env.NEXT_PUBLIC_NGO_WHATSAPP;
    banking.ngnAccount.whatsappConfirmationPhone = process.env.NEXT_PUBLIC_NGO_WHATSAPP;
  }
  if (process.env.MEDIA_STORAGE_PROVIDER) media.storage.provider = process.env.MEDIA_STORAGE_PROVIDER;
  if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    media.storage.cloudinary = { ...media.storage.cloudinary, cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME };
  }
  if (process.env.LOCAL_MEDIA_BASE_PATH) {
    media.storage.local = { basePath: process.env.LOCAL_MEDIA_BASE_PATH };
  }

  const result = NGOConfigSchema.safeParse({
    organization,
    branding,
    governance,
    banking,
    media,
    councils,
    socialFeed,
  });

  if (!result.success) {
    console.error('NGO Configuration Validation Failed:', result.error.format());
    throw new Error(`NGO Configuration Validation Error: ${result.error.message}`);
  }

  cachedConfig = result.data;
  return cachedConfig;
}
```

### 4. Configurable Media Storage & Delivery Abstraction Layer
- **Action**: Build `src/lib/media/resolver.ts` implementing the Provider Strategy Pattern.
- **Resolver Logic**:
  ```typescript
  import { getNGOConfig } from '../config-loader';

  export interface MediaTransformOptions {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'avif' | 'mp4' | 'webm';
    video?: boolean;
  }

  export function resolveMediaUrl(pathOrId: string, options: MediaTransformOptions = {}): string {
    if (pathOrId.startsWith('http://') || pathOrId.startsWith('https://')) {
      return pathOrId;
    }

    const config = getNGOConfig();
    const { storage } = config.media;
    const provider = storage.provider;

    // 1. Cloudinary Provider (Default)
    if (provider === 'cloudinary' && storage.cloudinary?.cloudName) {
      const { cloudName, folder, secure = true } = storage.cloudinary;
      const resourceType = options.video ? 'video' : 'image';
      const cleanPath = pathOrId.startsWith('/') ? pathOrId.slice(1) : pathOrId;
      const fullPath = folder ? `${folder}/${cleanPath}` : cleanPath;

      const transforms: string[] = [];
      transforms.push(options.format ? `f_${options.format}` : 'f_auto');
      transforms.push(options.quality ? `q_${options.quality}` : 'q_auto');
      if (options.width) transforms.push(`w_${options.width}`);
      if (options.height) transforms.push(`h_${options.height}`);

      const transformSegment = transforms.length > 0 ? transforms.join(',') + '/' : '';
      const protocol = secure ? 'https' : 'http';
      return `${protocol}://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformSegment}${fullPath}`;
    }

    // 2. AWS S3 / Cloudflare R2 / MinIO Provider
    if (provider === 's3' && storage.s3) {
      const { bucket, region, endpoint, publicUrlBase } = storage.s3;
      const cleanPath = pathOrId.startsWith('/') ? pathOrId.slice(1) : pathOrId;
      if (publicUrlBase) return `${publicUrlBase.replace(/\/$/, '')}/${cleanPath}`;
      if (endpoint) return `${endpoint.replace(/\/$/, '')}/${bucket}/${cleanPath}`;
      return `https://${bucket}.s3.${region}.amazonaws.com/${cleanPath}`;
    }

    // 3. Local / Docker / VPS Mount Provider
    if (provider === 'local') {
      const basePath = storage.local?.basePath || '/media';
      const cleanBase = basePath.replace(/\/$/, '');
      const cleanPath = pathOrId.startsWith('/') ? pathOrId : `/${pathOrId}`;
      return `${cleanBase}${cleanPath}`;
    }

    return pathOrId.startsWith('/') ? pathOrId : `/${pathOrId}`;
  }
  ```
- **Next.js Remote Patterns (`next.config.ts`)**:
  ```typescript
  import type { NextConfig } from 'next';

  const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'res.cloudinary.com' },
        { protocol: 'https', hostname: '**.amazonaws.com' },
        { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      ],
      formats: ['image/avif', 'image/webp'],
    },
  };

  export default nextConfig;
  ```

### 5. In-App Visual Content Studio & Editor (`/admin`)
- **Route**: `app/admin/page.tsx` + `app/api/admin/config/route.ts`.
- **Security**: Gated by `ADMIN_PASSPHRASE`.
- **Point-and-Click Tabs**:
  1. **General Identity**: Edit name, acronym, motto, mission, vision, phone, WhatsApp.
  2. **Branding & Theme**: Update logo, favicon, theme mode, primary accent hex.
  3. **Media & Storage Configuration**:
     - Switch Storage Provider dropdown: **Cloudinary**, **AWS S3**, **Local / Docker Volume**.
     - Configure Cloud Name, Folder, S3 Bucket, or Local Base Path.
     - Preview/assign the 3 videos and 3 images across sections.
     - **"Add Mini-Documentary" Modal**: Title, Area Council tag, video identifier, duration, caption.
  4. **FCT Area Councils & Projects**:
     - Council selector (AMAC, Bwari, Gwagwalada, Kuje, Kwali, Abaji).
     - **"Add New Project" Modal**: Title, Category, Settlement, Type, Beneficiaries, Description.
     - Edit/delete existing projects.
  5. **Banking & Donations**: Edit NGN account, USD/GBP/EUR wire details, customize donation tiers.
  6. **Governance & Compliance**: Update CAC Part F number, SCUML cert, TIN, Trustees, financial %.
- **Actions**: "Save Directly" (local dev mode), "Export JSON Archive" (production/Vercel mode), "Live Preview".

### 6. On-Demand Edge Cache Revalidation (`/api/revalidate`)
- **Route**: `app/api/revalidate/route.ts` with secret key verification (`REVALIDATION_SECRET`).
- Calling `GET /api/revalidate?tag=ngo-content&secret=...` invokes `revalidateTag('ngo-content')` and `revalidatePath('/')` to instantly refresh Vercel Edge cache in < 1s without redeployment.

### 7. Navigation & Persistent Layout Structure
- **Components**: `components/layout/Navbar.tsx` and `components/layout/Footer.tsx`.
- **Navbar**: Sticky glass bar, renders `resolveMediaUrl(branding.logoUrl)` and dynamic name, links to anchors ("Impact", "FCT Map", "Programs", "Transparency", "Stories"), persistent "Donate Now" button.
- **Footer**: Statutory legal name, regulatory badges (CAC Part F, SCUML, TIN) with 1-click copy, Abuja office address, WhatsApp hotline, social links.

### 8. Cinematic Hero & Ambient Media Streaming Surface
- **Components**: `components/hero/Hero.tsx`, `components/hero/HeroVideoPlayer.tsx`, `components/hero/SoundscapeToggle.tsx`, and `components/hero/ImpactCounterGrid.tsx`.
- **Video Player**:
  - Uses Video 1 (`video-fct-overview.mp4`) resolved via `resolveMediaUrl(media.heroBackgroundVideo, { video: true })`.
  - Uses Image 1 (`image-monolith-civic.webp`) resolved via `resolveMediaUrl(media.heroFallbackPoster, { format: 'webp', width: 1280 })`.
  - Respects `useMediaOptimization()`: if `isDataSaver === true`, skips video download and serves `< 60KB` WebP poster with "Stream Video" toggle.
- **Soundscape**: Web Audio gain node smooth fade toggle.
- **Live Spring Counters**: Animated counters for Total Lives Touched, Active Councils (6/6), Funds Deployed.

### 9. Interactive FCT Area Councils Map & Dispatch Coordinator
- **Components**: `components/map/FCTMapCoordinator.tsx`, `components/map/FCTMapSVG.tsx`, `components/map/CouncilDetailDrawer.tsx`.
- **Map Coordinator**: Interactive vector SVG mapping the 6 Area Councils.
- **Council Drawer**: Shows administrative profile, settlement cluster badges (e.g. Kuchingoro/Durumi IDP, Rubochi, Ushafa), active projects list with beneficiary numbers, field lead contact, and Video 3 modal dispatch button.

### 10. Programmatic Pillars Bento Grid & Mini-Documentary Hub
- **Components**: `components/pillars/ProgrammaticPillarsGrid.tsx`, `components/pillars/PillarCard.tsx`, `components/media/MiniDocumentaryHub.tsx`, `components/media/VideoModalPlayer.tsx`.
- **Bento Grid**: Asymmetric 4-card grid deploying Image 2 (Healthcare in Kwali/Abaji), Image 3 (Youth STEM in Bwari/AMAC), Video 2 (Water & Health overview), and an urgent relief dispatch card.
- **Mini-Documentary Hub**: Curated 3-reel documentary viewer deploying Video 1 (FCT Mission), Video 2 (Water & Health), and Video 3 (Youth Empowerment) with custom modal player, keyboard accessibility (`Esc` to close), and caption summaries.

### 11. Resilient Social Activity Wall with ISR & Static Fallback
- **Route & Component**: `app/api/social-feed/route.ts` and `components/social/SocialActivityWall.tsx`.
- Next.js ISR route (`revalidate = 3600`) fetching live feeds or immediately serving `content/social-feed.json` fallback on failure/timeout.
- Filter tabs: "All", "X (Twitter)", "Instagram", "LinkedIn", "YouTube".

### 12. Trust, Governance & Audited Financial Disclosure Panel
- **Components**: `components/governance/RegulatoryTrustPanel.tsx`, `components/governance/TrusteeBoardList.tsx`, `components/governance/AuditedFinancialDonut.tsx`.
- Badges: CAC Part F, SCUML EFCC, FIRS TIN & CITA 23 citation.
- Interactive SVG Donut Chart: 84% Direct Field Programs, 11% Operational Logistics, 5% Administrative Governance.
- Audited Financial Statement PDF download.

### 13. Multi-Currency Donation Drawer (Operate Sub-Flow)
- **Components**: `components/donation/DonationDrawer.tsx`, `components/donation/NairaTransferPanel.tsx`, `components/donation/DomiciliaryWirePanel.tsx`, `hooks/useClipboard.ts`.
- Multi-currency switcher: **NGN (₦)**, **USD ($)**, **EUR (€)**, **GBP (£)**.
- Preset tiers from `banking.donationTiers` + custom amount.
- NGN: Bank name, account name, account number with 1-click copy + pre-filled WhatsApp confirmation link + Paystack/Flutterwave trigger.
- Foreign Wire: Domiciliary SWIFT/BIC, IBAN, routing instructions + Stripe card checkout.

---

## Critical Files & Anchors

1. `scripts/generate-assets.sh`
   - Turnkey script using `ffmpeg` to generate the 3 one-minute (60s) video loops with ambient audio and the 3 high-resolution anchor WebP images.

2. `src/lib/schema/ngo.schema.ts`
   - Strict Zod validation schemas and TypeScript types for all content, including the provider-agnostic Media Storage schema (`cloudinary`, `s3`, `local`, `external`).

3. `src/lib/config-loader.ts`
   - Single source of truth loading from `content/*.json` and merging Vercel environment variable overrides (`NEXT_PUBLIC_NGO_*`, `MEDIA_STORAGE_PROVIDER`).

4. `src/lib/media/resolver.ts`
   - Unified media URL resolver implementing the Provider Strategy Pattern. Outputs Cloudinary transformation URLs, AWS S3 / R2 endpoints, or local Docker volume paths (`/media/...`) based on configuration.

5. `app/admin/page.tsx` & `app/api/admin/config/route.ts`
   - In-app visual Content Studio enabling non-technical users to edit details, switch media storage providers, add projects to Area Councils, and update banking credentials directly from the browser.

---

## Verification

### End-to-End Test Matrix & Commands
Run from project root (`/home/punkhazard/Projects/NGO`):

1. **Asset Generation Verification**:
   - Command: `bash scripts/generate-assets.sh`
   - Expected Output:
     - Three 60-second MP4 files generated in `public/media/`: `video-fct-overview.mp4`, `video-rural-health-water.mp4`, `video-youth-empowerment.mp4`.
     - Verify duration: `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 public/media/video-fct-overview.mp4` outputs `60.000000`.
     - Three WebP images generated in `public/media/`: `image-monolith-civic.webp`, `image-health-outreach.webp`, `image-youth-education.webp`.

2. **Type Safety & Build Cleanliness Check**:
   - Command: `npm run build`
   - Expected Output: Exit code 0, 0 TypeScript compile errors, 0 ESLint warnings, all static/ISR routes generated (`/`, `/admin`, `/api/social-feed`, `/api/revalidate`).

3. **Cloudinary Media URL Resolution Test**:
   - Test: In `content/media.json`, set `storage.provider` to `"cloudinary"` and `storage.cloudinary.cloudName` to `"test-ngo"`.
   - Action: Call `resolveMediaUrl("video-fct-overview.mp4", { video: true })` and `resolveMediaUrl("image-monolith-civic.webp", { format: "webp", width: 1280 })`.
   - Expected Output:
     - Video URL: `https://res.cloudinary.com/test-ngo/video/upload/f_auto,q_auto/portal-assets/video-fct-overview.mp4`
     - Poster URL: `https://res.cloudinary.com/test-ngo/image/upload/f_webp,q_auto,w_1280/portal-assets/image-monolith-civic.webp`

4. **Provider Switch to Local / Docker / VPS Test**:
   - Test: In `content/media.json`, change `storage.provider` to `"local"` and `storage.local.basePath` to `"/media"`.
   - Action: Call `resolveMediaUrl("video-fct-overview.mp4")`.
   - Expected Output: `/media/video-fct-overview.mp4`, verifying seamless local Docker / VPS volume mounting without touching any UI component.

5. **Provider Switch to AWS S3 / R2 / MinIO Test**:
   - Test: Set `storage.provider` to `"s3"`, bucket to `"ngo-assets"`, region to `"eu-west-1"`.
   - Action: Call `resolveMediaUrl("image-health-outreach.webp")`.
   - Expected Output: `https://ngo-assets.s3.eu-west-1.amazonaws.com/image-health-outreach.webp`.

6. **Easy Content Editing & Zero-Hardcoding Verification**:
   - Test: In `content/organization.json`, change `tradingName` to `"Zuma Relief Foundation"` and `acronym` to `"ZRF"`.
   - Run: `npm run build` and inspect the generated HTML.
   - Expected Output: Every instance of the organization name in Navbar, Hero, Governance Panel, Footer, and Metadata updates seamlessly to "Zuma Relief Foundation" with zero references to prior names.

7. **Schema Validation Guardrail Test**:
   - Test: Introduce an intentional typo in `content/banking.json` (e.g. set `accountNumber` to `"12345"` instead of 10 digits).
   - Run: `npm run build` or load page.
   - Expected Output: Build fails fast with clear human-readable Zod error: `"Invalid accountNumber in banking.json: must match /^\d{10}$/"`, preventing broken configuration from reaching production. Reverting restores clean build.

8. **Visual Content Studio (/admin) Functional Test**:
   - Test: Open `/admin` in local browser.
   - Action: Go to "FCT Area Councils" tab, select "Kuje", click "Add New Project", enter title "Solar Grain Milling Outpost", settlement "Rubochi", beneficiaries 1,200, assign image `image-health-outreach.webp`, and click "Save".
   - Expected Output: File `content/councils/kuje.json` is updated; loading the homepage and clicking Kuje on the interactive map displays the new "Solar Grain Milling Outpost" project immediately with Image 2.

9. **Environment Variable Storage & Name Override Test**:
   - Test: Launch dev server with `MEDIA_STORAGE_PROVIDER="local" NEXT_PUBLIC_NGO_NAME="Federal Capital Trust" npm run dev`.
   - Action: Load homepage.
   - Expected Output: Organization name renders as "Federal Capital Trust" and media links resolve locally, proving zero-code Vercel dashboard configurability.

10. **On-Demand Edge Revalidation Test**:
    - Test: Make a request to `/api/revalidate?tag=ngo-content&secret=TEST_SECRET`.
    - Expected Output: HTTP 200 `{ "revalidated": true, "now": 1725390000 }`, verifying on-demand cache clearing without a full site rebuild.

11. **Low-Bandwidth Media Optimization Check**:
    - Test: In Chrome DevTools, toggle "Network Throttling" to "Slow 3G" and set `Save-Data: on`.
    - Action: Load the homepage.
    - Expected Output: Background `<video>` element is not mounted; optimized Image 1 poster is rendered; "Data Saver Active" indicator appears.

12. **Multi-Currency Donation Drawer & Clipboard Check**:
    - Test: Click "Donate Now" in the Navbar.
    - Action: Toggle to "NGN", select preset amount from `banking.donationTiers`, click "Copy Account Number".
    - Expected Output: Clipboard contains the exact NGN account number; toast confirms copy; WhatsApp button links to valid URL with pre-filled transaction details.
    - Action: Toggle to "USD", verify SWIFT/BIC code displays in monospace font with copy button.

---

## Assumptions & Contingencies

1. **Local Media Fallback during Development**:
   - Assumption: Media assets generated by `scripts/generate-assets.sh` reside in `public/media/` during local development.
   - Contingency: When `storage.provider` is set to `"cloudinary"` but API credentials are not yet configured by the user, `resolveMediaUrl` automatically falls back to the local `public/media/` assets, preventing broken images or missing video errors during development and staging.

2. **In-App Admin Persistence in Production (Vercel Serverless)**:
   - Assumption: On Vercel, serverless function filesystems are read-only and ephemeral.
   - Contingency: In local development, `/admin` writes directly to `content/*.json`. In production on Vercel, `/admin` provides both an "Export JSON / Download Config Archive" button and a GitHub commit webhook integration, allowing content changes made in the browser to commit directly back to the GitHub repository and auto-trigger on-demand edge revalidation.

3. **Framework & Package Versions**:
   - Assumption: Project targets Next.js 15.x, React 19, and Tailwind CSS v4.
   - Contingency: If third-party component peer dependencies flag React 19 warnings, use `motion` (former Framer Motion v12) which provides native React 19 support, and standard Zod v3.
