import {chromium} from "playwright";

export async function getScheduledPowerOutages(url: string, city: string) {
  const browser = await chromium.launch({headless: false});
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(url);
  const selector = page.getByLabel("Selector de localidad");

  await selector.selectOption({label: city});

  try {
    await page.waitForSelector("#tp__content-table", {timeout: 3000});

    return true;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "TimeoutError") {
        return false;
      }
    }
  } finally {
    await browser.close();
  }
}
