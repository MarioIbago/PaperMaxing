import { chromium } from "playwright";

const baseUrl = process.env.PAPERMAXING_TEST_URL || "http://127.0.0.1:3000";
const viewports = [320, 375, 390, 430, 768, 1024, 1280, 1440];
const browser = await chromium.launch({ headless: true });

async function assertNoHorizontalOverflow(page, label, width) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));
  const actual = Math.max(metrics.scrollWidth, metrics.bodyScrollWidth);
  if (actual > metrics.clientWidth + 2) {
    throw new Error(`${label} overflows horizontally at ${width}px: ${actual}px > ${metrics.clientWidth}px`);
  }
}

try {
  for (const width of viewports) {
    const page = await browser.newPage({ viewport: { width, height: width <= 430 ? 844 : 900 } });

    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: /Master any research paper/i }).waitFor();
    await page.getByRole("button", { name: /Start PaperMaxing/i }).waitFor();
    await assertNoHorizontalOverflow(page, "Landing", width);

    await page.goto(`${baseUrl}/settings/open-source`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: /PaperMaxing Settings/i }).waitFor();
    await page.getByRole("button", { name: /OpenRouter/i }).waitFor();
    await page.getByRole("button", { name: /Anthropic \/ Claude/i }).waitFor();
    await assertNoHorizontalOverflow(page, "Settings", width);

    if (width <= 430) {
      const modelInput = page.getByLabel("Model ID");
      await modelInput.scrollIntoViewIfNeeded();
      if (!(await modelInput.isVisible())) throw new Error(`Model selector is not visible at ${width}px`);
    }

    await page.close();
  }

  console.log(`PaperMaxing responsive smoke passed at: ${viewports.join(", ")} px`);
} finally {
  await browser.close();
}
