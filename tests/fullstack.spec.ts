import { test, expect } from "@playwright/test";

// Minimal valid 2x2 PNG buffer
const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVQImWNgYGD4z8DAwMgAI0AMAC4BAf9S+2sAAAAASUVORK5CYII=",
  "base64"
);

test.describe("Ikechukwu Egbo & IYKOMO-TECH Full-Stack Verification", () => {
  test("1. Public pages render seeded content, flagship links, valid images, zero 500s, and clean mobile/desktop geometry", async ({
    page,
  }) => {
    const errors: string[] = [];
    const serverErrors: string[] = [];

    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("response", (res) => {
      if (res.url().includes("/api/") && res.status() >= 500) {
        serverErrors.push(`${res.status()} ${res.url()}`);
      }
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    await expect(page.locator("h1")).toContainText(
      "Building Resilient Software Products"
    );
    await expect(
      page.locator('a[href="https://iykbook.iykomotech.com"]').first()
    ).toBeVisible();
    await expect(
      page.locator('a[href="https://iykschool.iykomotech.com"]').first()
    ).toBeVisible();
    await expect(
      page
        .locator(
          'a[href="https://github.com/ikechukwuegbo/ikechukwuegbo.github.io"]'
        )
        .first()
    ).toBeVisible();

    // Check all visible images have naturalWidth > 0
    const imgCount = await page.locator("img").count();
    expect(imgCount).toBeGreaterThan(0);
    for (let i = 0; i < imgCount; i++) {
      const img = page.locator("img").nth(i);
      if (await img.isVisible()) {
        const naturalWidth = await img.evaluate(
          (el: HTMLImageElement) => el.naturalWidth
        );
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }

    // Check horizontal overflow on desktop
    const desktopOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(desktopOverflow).toBe(false);

    // Check mobile viewport (375px)
    await page.setViewportSize({ width: 375, height: 812 });
    const mobileOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(mobileOverflow).toBe(false);

    // Visit remaining public routes
    for (const route of [
      "/about",
      "/portfolio",
      "/projects",
      "/projects/iykbook",
      "/services",
      "/certificates",
      "/blog",
      "/contact",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
    }

    // The AI substitute portrait must NEVER be referenced anywhere on the site
    for (const route of ["/", "/about"]) {
      await page.goto(route);
      const aiPortraitCount = await page.locator(
        'img[src*="iyke-portrait"], img[src*="hero-avatar"]'
      ).count();
      expect(aiPortraitCount).toBe(0);
    }

    // Hero must use the premium dark mesh background
    await page.goto("/");
    const heroClass = await page
      .locator("section")
      .first()
      .getAttribute("class");
    expect(heroClass).toContain("hero-mesh");

    // Stat band should render on the homepage
    await expect(page.getByText("Infrastructure Uptime")).toBeVisible();

    // Case study pages must render the official product artwork
    await page.goto("/projects/iykbook");
    await expect(
      page.locator('img[alt*="iykbook official product flyer"]').first()
    ).toBeVisible();
    await page.goto("/projects/iykschool");
    await expect(
      page.locator('img[alt*="iykschool brand identity system"]').first()
    ).toBeVisible();

    // Download page must expose the source ZIP and admin credentials
    await page.goto("/downloads");
    const downloadLink = page.locator('a[href*="iykomo-tech-communication-source.zip"]');
    await expect(downloadLink.first()).toBeVisible();
    await expect(page.getByText("admin@iykomotech.com").first()).toBeVisible();

    // The ZIP itself must download successfully
    const zipRes = await page.request.get(
      "/downloads/iykomo-tech-communication-source.zip"
    );
    expect(zipRes.status()).toBe(200);
    expect(zipRes.headers()["content-type"]).toContain("zip");

    // Contact page must expose official support + sales mailboxes
    await page.goto("/contact");
    await expect(page.getByText("Support & General Enquiries")).toBeVisible();
    await expect(
      page.getByText("support@iykomotech.com").first()
    ).toBeVisible();
    await expect(page.getByText("sales@iykomotech.com").first()).toBeVisible();

    expect(errors).toEqual([]);
    expect(serverErrors).toEqual([]);
  });

  test("2. Server-side security enforces 401 on unauthenticated APIs and redirects /admin to /admin/login", async ({
    page,
    request,
  }) => {
    const overviewRes = await request.get("/api/admin/overview");
    expect(overviewRes.status()).toBe(401);

    const createProjRes = await request.post("/api/projects", {
      data: { title: "Unauthorized Attempt" },
    });
    expect(createProjRes.status()).toBe(401);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("3. Contact form submission persists to PostgreSQL and appears in Admin Enquiry Inbox", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/contact");

    await page.fill("#contact-name", "Chinedu Okafor");
    await page.fill("#contact-email", "chinedu@enterprise-client.com");
    await page.fill(
      "#contact-subject",
      "Enterprise VLAN & iykbook Deployment"
    );
    await page.fill(
      "#contact-message",
      "We want to deploy iykbook across three branches and upgrade office switches."
    );
    await page.click('button[type="submit"]');

    await expect(page.getByText("Message Received — Thank You!")).toBeVisible();

    // Login to Admin Console and verify enquiry appears
    await page.goto("/admin/login");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/admin");

    await page.getByRole("button", { name: /Enquiry Inbox/i }).first().click();
    await expect(
      page.getByText("Enterprise VLAN & iykbook Deployment").first()
    ).toBeVisible();
  });

  test("4. Admin dynamic Project CRUD + Media Upload persists in PostgreSQL and reflects live on Public Projects page", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin/login");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/admin");

    // The portrait photo setup card must be front-and-centre on the dashboard
    await expect(
      page.getByText(/Your Portrait Photo/).first()
    ).toBeVisible();
    await expect(
      page.getByText(/Drag & drop your photo here/).first()
    ).toBeVisible();

    // Clean any leftover test project first if present
    await page
      .getByRole("button", { name: /Projects & Portfolio/i })
      .first()
      .click();
    const existingDeleteButtons = page.locator(
      'button[aria-label="Delete iykmonitor — Cloud Uptime Sentinel"]'
    );
    while ((await existingDeleteButtons.count()) > 0) {
      await existingDeleteButtons.first().click();
      await expect(page.getByText(/Deleted/i)).toBeVisible();
    }

    // Upload real PNG in Media Library
    await page.getByRole("button", { name: /Media Library/i }).first().click();
    const fileInput = page.locator('input[aria-label="Upload Media File"]');
    await fileInput.setInputFiles({
      name: "test-badge.png",
      mimeType: "image/png",
      buffer: TINY_PNG,
    });
    await expect(page.getByText("test-badge.png").first()).toBeVisible();

    const uploadedImg = page.locator('img[alt="test-badge.png"]').first();
    await expect(uploadedImg).toBeVisible();
    const nw = await uploadedImg.evaluate(
      (el: HTMLImageElement) => el.naturalWidth
    );
    expect(nw).toBeGreaterThan(0);

    // Reload page and confirm uploaded media persists in PostgreSQL
    await page.reload();
    await page.getByRole("button", { name: /Media Library/i }).first().click();
    await expect(page.getByText("test-badge.png").first()).toBeVisible();

    // Create new Project from Admin Console
    await page
      .getByRole("button", { name: /Projects & Portfolio/i })
      .first()
      .click();

    await page.fill("#proj-title", "iykmonitor — Cloud Uptime Sentinel");
    await page.fill(
      "#proj-tagline",
      "Automated multi-region server, SSL certificate, and PostgreSQL health monitor."
    );
    await page.fill(
      "#proj-desc",
      "Built for real-time enterprise SLA visibility across IYKOMO-TECH client infrastructure."
    );
    await page.fill("#proj-live", "https://iykbook.iykomotech.com");
    await page.click('button:has-text("Publish Project")');

    await expect(
      page.getByText(/Published "iykmonitor — Cloud Uptime Sentinel"/i)
    ).toBeVisible();

    // Visit Public Projects Page without rebuilding code -> verify project is visible!
    await page.goto("/projects");
    await expect(
      page.getByText("iykmonitor — Cloud Uptime Sentinel")
    ).toBeVisible();

    // Return to Admin Console -> Delete project cleanly and wait for server response
    await page.goto("/admin");
    await page
      .getByRole("button", { name: /Projects & Portfolio/i })
      .first()
      .click();

    await page
      .locator('button[aria-label="Delete iykmonitor — Cloud Uptime Sentinel"]')
      .click();
    await expect(
      page.getByText('Deleted "iykmonitor — Cloud Uptime Sentinel".')
    ).toBeVisible();

    await page.goto("/projects");
    await expect(
      page.getByText("iykmonitor — Cloud Uptime Sentinel")
    ).toHaveCount(0);
  });
});
