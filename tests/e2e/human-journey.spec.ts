/**
 * Human Real Usage Browser E2E Test Suite
 *
 * Implements the comprehensive Playwright E2E browser test suite covering the full human visitor
 * and administrator journey as specified in e2e_plan Section 3:
 *
 * 3.1 Visitor Exploration & Responsive Layout (/)
 * 3.2 Hero Media, Ambient Audio & Data-Saver Simulation
 * 3.3 Interactive 6-Area Council Map & Slide-Over Drawer (/#fct-map)
 * 3.4 Programmatic Pillars Bento Grid & 3-Reel Documentary Modal (/#pillars, /#stories)
 * 3.5 Governance Transparency & Interactive Financial Donut (/#governance)
 * 3.6 Multi-Currency Donation Drawer & WhatsApp Integration Flow
 * 3.7 In-App Visual Content Studio Human Administrator Flow (/admin)
 */

import { test, expect } from "@playwright/test";

test.describe("Human Real Usage E2E Verification Suite", () => {
  test.beforeEach(async ({ context }) => {
    // Grant clipboard permissions for copy-to-clipboard interactions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  });

  // ============================================================================
  // 3.1 Visitor Exploration & Responsive Layout
  // ============================================================================
  test.describe("3.1 Visitor Exploration & Responsive Layout", () => {
    test("verifies page title, direction contract comment, sticky navbar, and desktop anchor navigation", async ({
      page,
      isMobile,
    }) => {
      await page.goto("/");

      // 1. Assert page title
      await expect(page).toHaveTitle(
        "Abuja Resilience Initiative | From Granite to Grassroots"
      );

      // 2. Assert Impeccable Direction Contract comment in HTML
      const htmlContent = await page.content();
      expect(htmlContent).toContain(
        "<!-- IMPECCABLE DIRECTION CONTRACT: Warm Afro-Modernism | Abuja Resilience Initiative -->"
      );

      // 3. Scroll and verify Navbar sticky behavior
      const header = page.locator("header");
      await expect(header).toBeVisible();

      // Scroll down past the 20px threshold
      await page.evaluate(() => window.scrollTo(0, 120));
      await page.waitForTimeout(300); // Allow scroll listener and transition
      await expect(header).toHaveClass(/backdrop-blur-md/);
      await expect(header).toHaveClass(/shadow-soft/);

      // 4. Click navigation anchors and verify targeting (desktop only)
      if (isMobile) return;

      const nav = page.locator('nav[aria-label="Main Navigation"]');
      // Click "FCT Map" -> smooth scroll targets #fct-map
      const fctMapLink = nav.getByRole("link", { name: "FCT Map" });
      await fctMapLink.click();
      await expect(page.locator("#fct-map")).toBeInViewport();

      // Click "Programs" -> smooth scroll targets #pillars
      const programsLink = nav.getByRole("link", { name: "Programs" });
      await programsLink.click();
      await expect(page.locator("#pillars")).toBeInViewport();

      // Click "Governance" -> smooth scroll targets #governance
      const governanceLink = nav.getByRole("link", { name: "Governance" });
      await governanceLink.click();
      await expect(page.locator("#governance")).toBeInViewport();

      // Click "Stories" -> smooth scroll targets #stories
      const storiesLink = nav.getByRole("link", { name: "Stories" });
      await storiesLink.click();
      await expect(page.locator("#stories")).toBeInViewport();
    });

    test("verifies mobile viewport behavior, drawer toggle, and Escape key dismissal", async ({
      page,
    }) => {
      // 5. Switch viewport to Mobile (375x812 iPhone profile)
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/");

      // Desktop navigation links hide
      const desktopNav = page.locator('nav[aria-label="Main Navigation"]');
      await expect(desktopNav).toBeHidden();

      // Hamburger button is visible
      const hamburgerBtn = page.getByRole("button", {
        name: "Toggle navigation menu",
      });
      await expect(hamburgerBtn).toBeVisible();

      // Clicking opens mobile navigation drawer
      await hamburgerBtn.click();
      const mobileNav = page.locator("#mobile-navigation");
      await expect(mobileNav).toBeVisible();

      // Verify mobile links & Donate CTA
      await expect(mobileNav.getByRole("link", { name: "Impact" })).toBeVisible();
      await expect(mobileNav.getByRole("link", { name: "FCT Map" })).toBeVisible();
      await expect(mobileNav.getByRole("link", { name: "Programs" })).toBeVisible();
      await expect(mobileNav.getByRole("link", { name: "Governance" })).toBeVisible();
      await expect(mobileNav.getByRole("link", { name: "Stories" })).toBeVisible();
      await expect(
        mobileNav.getByRole("button", { name: "Donate Now" })
      ).toBeVisible();

      // Pressing Escape closes mobile drawer
      await page.keyboard.press("Escape");
      await expect(mobileNav).toBeHidden();
    });
  });

  // ============================================================================
  // 3.2 Hero Media, Ambient Audio & Data-Saver Simulation
  // ============================================================================
  test.describe("3.2 Hero Media, Ambient Audio & Data-Saver Simulation", () => {
    test("verifies hero video attributes on standard connection", async ({
      page,
    }) => {
      await page.goto("/");

      const heroVideo = page
        .locator('section[aria-labelledby="hero-heading"]')
        .locator("video");
      await expect(heroVideo).toBeAttached();
      await expect(heroVideo).toHaveAttribute("muted", "");
      await expect(heroVideo).toHaveAttribute("loop", "");
      await expect(heroVideo).toHaveAttribute("playsinline", "");
    });

    test("simulates low-bandwidth data-saver mode, fallback poster, and manual stream play", async ({
      context,
    }) => {
      const dataSaverPage = await context.newPage();

      // Emulate navigator.connection with saveData=true and effectiveType='2g'
      await dataSaverPage.addInitScript(() => {
        Object.defineProperty(navigator, "connection", {
          configurable: true,
          get: () => ({
            saveData: true,
            effectiveType: "2g",
            addEventListener: () => {},
            removeEventListener: () => {},
          }),
        });
      });

      await dataSaverPage.goto("/");

      // Fallback poster image is displayed and manual play button is presented
      const manualPlayBtn = dataSaverPage.getByRole("button", {
        name: /Play.*Stream|Play ambient background video stream/i,
      });
      await expect(manualPlayBtn).toBeVisible();
      await expect(manualPlayBtn.getByText("Data Saver")).toBeVisible();

      // Clicking manual play triggers playback and hides the prompt
      await manualPlayBtn.click();
      await expect(manualPlayBtn).toBeHidden({ timeout: 5000 });

      await dataSaverPage.close();
    });

    test("toggles ambient soundscape synthesizer and animates acoustic pulse wave bars", async ({
      page,
    }) => {
      await page.goto("/");

      const soundscapeBtn = page.getByRole("button", {
        name: /Soundscape|Ambient Soundscape/i,
      });
      await expect(soundscapeBtn).toBeVisible();
      await expect(soundscapeBtn).toHaveAttribute("aria-pressed", "false");

      // Toggle active
      await soundscapeBtn.click();
      await expect(soundscapeBtn).toHaveAttribute("aria-pressed", "true");
      await expect(soundscapeBtn.getByText("Ambient On")).toBeVisible();

      // Verify acoustic pulse wave bars are rendering
      const waveBars = soundscapeBtn.locator('div[aria-hidden="true"] span');
      await expect(waveBars).toHaveCount(5);

      // Toggle again to mute
      await soundscapeBtn.click();
      await expect(soundscapeBtn).toHaveAttribute("aria-pressed", "false");
      await expect(soundscapeBtn.getByText("Soundscape")).toBeVisible();
    });

    test("verifies audited impact counter strip values after count-up transition", async ({
      page,
    }) => {
      await page.goto("/");

      const impactContainer = page.locator(
        '[aria-label="Audited impact indicators"]'
      );
      await impactContainer.scrollIntoViewIfNeeded();

      // Verify target values display after easing transition
      await expect(impactContainer.getByText("28,000+")).toBeVisible({
        timeout: 5000,
      });
      await expect(impactContainer.getByText(/6\s*\/\s*6/)).toBeVisible({
        timeout: 5000,
      });
      await expect(impactContainer.getByText("84%")).toBeVisible({
        timeout: 5000,
      });
    });
  });

  // ============================================================================
  // 3.3 Interactive 6-Area Council Map & Slide-Over Drawer (/#fct-map)
  // ============================================================================
  test.describe("3.3 Interactive 6-Area Council Map & Slide-Over Drawer", () => {
    test("verifies all 6 councils in SVG map, hover styling, detail drawer slide-over, and donation drawer cutover", async ({
      page,
    }) => {
      await page.goto("/#fct-map");

      // 1. Verify all 6 Area Councils in the SVG map
      const councils = ["amac", "bwari", "gwagwalada", "kuje", "kwali", "abaji"];
      for (const councilId of councils) {
        const councilPath = page.locator(`#council-path-${councilId}`);
        await expect(councilPath).toBeVisible();
        await expect(councilPath).toHaveAttribute("role", "button");
      }

      // 2. Hover over council path kwali (transitions stroke to terracotta)
      const kwaliPath = page.locator("#council-path-kwali");
      await kwaliPath.hover();
      await expect(kwaliPath).toHaveAttribute("stroke", "#B85D36");

      // 3. Click council kwali to open Council Detail Drawer
      await kwaliPath.click();

      const councilDrawer = page.getByRole("dialog");
      await expect(councilDrawer).toBeVisible();
      const drawerTitle = councilDrawer.locator("#council-drawer-title");
      await expect(drawerTitle).toBeVisible();
      await expect(drawerTitle).toHaveText(/Kwali Area Council/i);

      // Verify headquarters, terrain, dispatch lead phone, and active projects inside drawer
      await expect(councilDrawer.getByText(/HQ:\s*Kwali/i)).toBeVisible();
      await expect(councilDrawer.getByText(/Terrain:\s*Savannah Plains/i)).toBeVisible();
      await expect(councilDrawer.locator('a[href^="tel:"]').first()).toBeVisible();
      await expect(
        councilDrawer.getByText(/Yangoji Solar Borehole Network/i)
      ).toBeVisible();
      await expect(
        councilDrawer.getByText(/Kilankwa/i).first()
      ).toBeVisible();

      // 4. Click "Support Projects in this Council": verifies council drawer closes and donation drawer opens
      const supportCouncilBtn = councilDrawer.getByRole("button", {
        name: "Support Projects in this Council",
      });
      await supportCouncilBtn.click();
      // Council drawer slides closed
      await expect(drawerTitle).toBeHidden();

      // Donation drawer opens
      const donationTitle = page.locator("#donation-drawer-title");
      await expect(donationTitle).toBeVisible();

      // Close donation drawer with Escape
      await page.keyboard.press("Escape");
      await expect(donationTitle).toBeHidden();

      // 5. Verify Escape key closes council drawer and returns
      await kwaliPath.click();
      await expect(drawerTitle).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(drawerTitle).toBeHidden();
    });
  });

  // ============================================================================
  // 3.4 Programmatic Pillars Bento Grid & 3-Reel Documentary Modal
  // ============================================================================
  test.describe("3.4 Programmatic Pillars Bento Grid & 3-Reel Documentary Modal", () => {
    test("verifies pillars bento grid, donation drawer pre-selection, and 3-reel documentary video player modal", async ({
      page,
    }) => {
      await page.goto("/#pillars");

      // 1. Verify Pillars Bento Grid pillars
      await expect(
        page.getByRole("heading", { name: "Clean Aquifers & Primary Healthcare" })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Solar STEM & Ancestral Heritage" })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "IDP Resilience" })
      ).toBeVisible();

      // Click "Support Clean Water" -> Donation Drawer opens with Community Pillar tier pre-selected
      const supportWaterBtn = page.getByRole("button", {
        name: "Support Clean Water",
      });
      await supportWaterBtn.click();

      const donationTitle = page.locator("#donation-drawer-title");
      await expect(donationTitle).toBeVisible();
      await expect(page.getByText("Community Pillar")).toBeVisible();
      await expect(page.getByText("₦50,000")).toBeVisible();

      // Close drawer with Escape
      await page.keyboard.press("Escape");
      await expect(donationTitle).toBeHidden();

      // 2. Mini-Documentary Hub
      await page.locator("#stories").scrollIntoViewIfNeeded();

      // Verify 3 documentary cards
      await expect(
        page.getByRole("heading", { name: "The Monolith & The Margin" })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Clean Water & Maternal Care" })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Solar Code & Ancestral Clay" })
      ).toBeVisible();

      // Click Reel 2 ("Clean Water & Maternal Care")
      const reel2Card = page.getByRole("button", {
        name: /Clean Water & Maternal Care/i,
      });
      await reel2Card.click();

      // VideoModalPlayer opens full dialog with backdrop blur
      const modalDialog = page.getByRole("dialog");
      await expect(modalDialog).toBeVisible();

      const modalVideo = modalDialog.locator("video");
      await expect(modalVideo).toBeAttached();
      await expect(modalVideo).toHaveAttribute(
        "src",
        /rafting\.mp4|video-rural-health-water\.mp4/
      );

      // Verify title, council tag, and caption
      await expect(
        modalDialog.getByRole("heading", { name: "Clean Water & Maternal Care" })
      ).toBeVisible();
      await expect(modalDialog.getByText("Kwali & Kuje")).toBeVisible();
      await expect(modalDialog.locator("#video-modal-desc")).toContainText(
        "Deep aquifer solar drilling"
      );

      // Escape key closes modal cleanly
      await page.keyboard.press("Escape");
      await expect(modalDialog).toBeHidden();
    });
  });

  // ============================================================================
  // 3.5 Governance Transparency & Interactive Financial Donut (/#governance)
  // ============================================================================
  test.describe("3.5 Governance Transparency & Interactive Financial Donut", () => {
    test("verifies statutory compliance badges, copy action, interactive financial donut hover, and trustees list", async ({
      page,
    }) => {
      await page.goto("/#governance");

      const govSection = page.locator("#governance");
      await expect(govSection).toBeVisible();

      // 1. Compliance Badges: Click Copy on CAC badge
      const cacCopyBtn = govSection.getByRole("button", {
        name: /Copy Corporate Affairs Commission/i,
      });
      await expect(cacCopyBtn).toBeVisible();
      await cacCopyBtn.click();
      await expect(cacCopyBtn.getByText("Copied!")).toBeVisible();

      // Verify SCUML, FIRS TIN, and CITA Section 23 tax exemption text
      await expect(govSection.getByText(/SCUML-RN:\s*2023-09182/i)).toBeVisible();
      await expect(govSection.getByText("23910294-0001")).toBeVisible();
      await expect(
        govSection.getByText(/Section 23 of Companies Income Tax Act/i)
      ).toBeVisible();

      // 2. Interactive SVG Donut Chart
      const donutSvg = govSection.locator('svg[aria-label*="Audited Disbursal Chart"]');
      await expect(donutSvg).toBeVisible();

      // Verify legend items
      await expect(govSection.getByText("Direct Program Delivery").first()).toBeVisible();
      await expect(
        govSection.getByText("Field Logistics & Monitoring").first()
      ).toBeVisible();
      await expect(govSection.getByText("Administrative Governance").first()).toBeVisible();

      // Hover over the 84% direct delivery segment
      const programSlice = donutSvg.locator(
        'circle[aria-label*="Direct Program Delivery"]'
      );
      await programSlice.hover({ force: true });
      // Verify center text shows 84%
      await expect(donutSvg.locator("..").getByText("84%")).toBeVisible();

      // 3. Trustee Board Roster
      await expect(
        govSection.getByText("Hon. Dr. Amina Bello")
      ).toBeVisible();
      await expect(
        govSection.getByText("Engr. Chidi Okafor")
      ).toBeVisible();
      await expect(
        govSection.getByText("Hajia Zainab Kuje")
      ).toBeVisible();
      await expect(
        govSection.getByText("Barr. Tunde Adeleke")
      ).toBeVisible();
    });
  });

  // ============================================================================
  // 3.6 Multi-Currency Donation Drawer & WhatsApp Flow
  // ============================================================================
  test.describe("3.6 Multi-Currency Donation Drawer & WhatsApp Flow", () => {
    test("verifies donation drawer opening, GTBank NGN transfer copy, WhatsApp link generation, and domiciliary currency switching", async ({
      page,
    }) => {
      await page.goto("/");

      // 1. Click primary "Donate Now" button in Navbar
      const donateBtn = page
        .getByRole("button", { name: /Donate/i })
        .first();
      await donateBtn.click();

      // 2. Drawer slides in with Sacred Earth Crest and title
      const donationDrawer = page.getByRole("dialog");
      await expect(donationDrawer).toBeVisible();
      await expect(
        donationDrawer.getByText(/Sacred Earth Crest/i)
      ).toBeVisible();
      await expect(page.locator("#donation-drawer-title")).toHaveText(
        "Supporting Abuja Grassroots"
      );

      // 3. Default NGN: displays GTBank account, sort code, and copy interaction
      await expect(
        donationDrawer.getByText("Guaranty Trust Bank (GTBank)").first()
      ).toBeVisible();
      await expect(donationDrawer.getByText("0123456789")).toBeVisible();
      await expect(donationDrawer.getByText("058152062")).toBeVisible();

      const copyAccountBtn = donationDrawer.getByRole("button", {
        name: "Copy account number",
      });
      await copyAccountBtn.click();
      await expect(copyAccountBtn.getByText("Copied")).toBeVisible();

      // 4. Select preset tier ₦50,000: impact text updates to Community Pillar
      await donationDrawer.getByRole("button", { name: /₦50,000/i }).click();
      await expect(
        donationDrawer.getByText(/Direct Grassroots Impact:\s*Community Pillar/i)
      ).toBeVisible();
      await expect(
        donationDrawer.getByText(
          /Supplies maternal clinical delivery kits and solar refrigeration/i
        )
      ).toBeVisible();

      // 5. Verify WhatsApp confirmation button href contains phone number and amount
      const waLink = donationDrawer.getByRole("link", {
        name: "Confirm Transfer on WhatsApp",
      });
      await expect(waLink).toBeVisible();
      const href = await waLink.getAttribute("href");
      expect(href).not.toBeNull();
      expect(href).toContain("wa.me/2348039001234");
      expect(href).toMatch(/(?:50%2C000|50,000)/);

      // 6. Switch to USD tab: DomiciliaryWirePanel mounts with GTBank USD and SWIFT
      await donationDrawer.getByRole("button", { name: "$ USD" }).click();
      await expect(
        donationDrawer.getByText("Cross-Border Wire (USD)")
      ).toBeVisible();
      await expect(donationDrawer.getByText("0123456790", { exact: true })).toBeVisible();
      await expect(donationDrawer.getByText("GTBINGLA").first()).toBeVisible();

      // Switch to EUR
      await donationDrawer.getByRole("button", { name: "€ EUR" }).click();
      await expect(
        donationDrawer.getByText("Cross-Border Wire (EUR)")
      ).toBeVisible();
      await expect(donationDrawer.getByText("0123456791", { exact: true })).toBeVisible();
      await expect(donationDrawer.getByText("GTBINGLA").first()).toBeVisible();

      // Switch to GBP
      await donationDrawer.getByRole("button", { name: "£ GBP" }).click();
      await expect(
        donationDrawer.getByText("Cross-Border Wire (GBP)")
      ).toBeVisible();
      await expect(donationDrawer.getByText("0123456792", { exact: true })).toBeVisible();
      await expect(donationDrawer.getByText("GTBINGLA").first()).toBeVisible();
      // 7. Close drawer via Escape
      await page.keyboard.press("Escape");
      await expect(donationDrawer).toBeHidden();
    });
  });

  // ============================================================================
  // 3.7 In-App Visual Content Studio Flow (/admin)
  // ============================================================================
  test.describe("3.7 In-App Visual Content Studio Flow (/admin)", () => {
    test("verifies passphrase authentication, live editing, project CRUD, storage toggle, toolbar actions, and portal reflection", async ({
      page,
    }) => {
      await page.goto("/admin");

      // 1. Passphrase Gate Screen
      const passphraseInput = page.locator("#passphrase");
      await expect(passphraseInput).toBeVisible();

      // Enter invalid passphrase "wrong-pass"
      await passphraseInput.fill("wrong-pass");
      await page.getByRole("button", { name: /Unlock/i }).click();
      await expect(
        page.getByText("Invalid administrative passphrase")
      ).toBeVisible();

      // Enter valid passphrase "abuja-resilience-2025"
      await passphraseInput.fill("abuja-resilience-2025");
      await page.getByRole("button", { name: /Unlock/i }).click();

      // Studio unlocks and reveals toolbar and tabs
      await expect(
        page.getByText("Abuja NGO Content Studio")
      ).toBeVisible();

      const expectedTabs = [
        "General Identity",
        "Branding & Theme",
        "Media & Storage",
        "Councils & Projects",
        "Banking & Wire",
        "Governance & Trust",
      ];
      for (const tab of expectedTabs) {
        await expect(page.getByRole("button", { name: tab })).toBeVisible();
      }

      // 2. Tab 1 "General Identity": change tradingName
      const tradingNameInput = page.getByLabel("Trading / Brand Name");
      await expect(tradingNameInput).toBeVisible();
      await tradingNameInput.fill("Abuja Resilience Initiative (Live E2E)");

      // 3. Tab 4 "Councils & Projects": select Kuje, add new project
      await page.getByRole("button", { name: "Councils & Projects" }).click();
      await page.getByRole("button", { name: /Kuje/i }).click();

      // Click "Add Field Project"
      await page.getByRole("button", { name: /Add Field Project/i }).click();

      // Fill Add Field Project modal
      const projectTitleInput = page.getByPlaceholder(
        /Solar Borehole Installation/i
      );
      await expect(projectTitleInput).toBeVisible();
      await projectTitleInput.fill("Rubochi Agro-Solar Grain Mill");

      // Select category "agriculture"
      await page.locator("form select").first().selectOption("agriculture");

      // Fill settlement
      await page.getByPlaceholder(/Pegi Settlement/i).fill("Rubochi Community");

      // Fill beneficiaries 1200
      await page.locator('form input[type="number"]').fill("1200");

      // Save project
      await page
        .getByRole("button", { name: "Create Field Project" })
        .click();

      // Verify newly created project appears in active field initiatives
      await expect(
        page.getByText("Rubochi Agro-Solar Grain Mill").first()
      ).toBeVisible();

      // 4. Tab 3 "Media & Storage": toggle provider between local and cloudinary
      await page.getByRole("button", { name: "Media & Storage" }).click();
      const cloudinaryBtn = page.getByRole("button", {
        name: /Cloudinary CDN/i,
      });
      const localBtn = page.getByRole("button", {
        name: /Local Static/i,
      });

      await cloudinaryBtn.click();
      await expect(cloudinaryBtn).toHaveClass(/border-\[#4EAA86\]/);

      await localBtn.click();
      await expect(localBtn).toHaveClass(/border-\[#4EAA86\]/);

      // 5. Toolbar actions
      // A: Save to Content Files
      const saveBtn = page.getByRole("button", {
        name: "Save to Content Files",
      });
      await saveBtn.click();
      await expect(
        page.getByText(
          /Configuration saved and updated successfully|Vercel serverless environment is read-only/i
        )
      ).toBeVisible({ timeout: 8000 });

      // B: Download JSON Archive
      const downloadPromise = page.waitForEvent("download");
      await page.getByRole("button", { name: /Archive|Download/i }).click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(
        /^abuja-ngo-config.*\.json$/
      );

      // C: Purge Edge Cache
      const purgeBtn = page.getByRole("button", {
        name: /Purge.*Edge Cache/i,
      });
      await purgeBtn.click();
      await expect(
        page.getByText(/Edge cache purged on-demand|revalidated/i)
      ).toBeVisible({ timeout: 8000 });
      // 6. Navigate to "/" and confirm updated name is reflected
      await page.goto("/");
      await expect(
        page.getByText("Abuja Resilience Initiative (Live E2E)").first()
      ).toBeVisible();

      // 7. Return to "/admin" and restore original name "Abuja Resilience Initiative" for clean state
      await page.goto("/admin");
      if (await page.locator("#passphrase").isVisible()) {
        await page.locator("#passphrase").fill("abuja-resilience-2025");
        await page.getByRole("button", { name: /Unlock/i }).click();
      }
      // Delete newly added test project from Kuje
      await page.getByRole("button", { name: "Councils & Projects" }).click();
      await page.getByRole("button", { name: /Kuje/i }).click();
      const rubochiDeleteBtn = page
        .locator('div:has-text("Rubochi Agro-Solar Grain Mill")')
        .locator('button[title="Delete project"]')
        .first();
      if (await rubochiDeleteBtn.isVisible()) {
        await rubochiDeleteBtn.click();
      }

      await page.getByRole("button", { name: "General Identity" }).click();
      const restoreInput = page.getByLabel("Trading / Brand Name");
      await restoreInput.fill("Abuja Resilience Initiative");
      await page.getByRole("button", { name: "Save to Content Files" }).click();
      await expect(
        page.getByText(
          /Configuration saved and updated successfully|Vercel serverless environment is read-only/i
        )
      ).toBeVisible({ timeout: 8000 });
    });
  });
});
