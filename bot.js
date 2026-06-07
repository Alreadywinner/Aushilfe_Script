const { chromium } = require("@playwright/test");
require("dotenv").config();

async function runBot() {
  const browser = await chromium.launch({ headless: false }); // Set to true for background mode
  const context = await browser.newContext();
  const page = await context.newPage();

  // --- STEP 1: INITIAL LOGIN ---
  console.log("Starting initial login...");
  await page.goto("https://aushilfen.yhd.de/login.php");

  await page
    .getByRole("textbox", { name: "E-Mail-Adresse" })
    .fill(process.env.email);
  await page
    .getByRole("textbox", { name: "Passwort" })
    .fill(process.env.password);
  await page.getByRole("button", { name: "Anmelden" }).click();

  // Wait for the dashboard to load to ensure login succeeded
  await page.waitForLoadState("networkidle");
  console.log("Login successful!");

  // --- STEP 2: INFINITE MONITORING LOOP ---
  while (true) {
    try {
      console.log(
        `Checking for shifts at ${new Date().toLocaleTimeString()}...`,
      );

      // Send the payload as form data
      const response = await page.request.post(
        "https://aushilfen.yhd.de/functionen/get_event.php",
        {
          form: {
            op: "GastroAushilfe",
            start: "2026-06-01",
            end: "2026-07-13",
          },
        },
      );

      const shifts = await response.json();

      // Filter for available orange shifts
      const availableOrangeShifts = shifts.filter(
        (s) =>
          s.className && s.className.includes("termin_orange") && s.offen === 1,
      );
      console.log(
        `Found ${JSON.stringify(availableOrangeShifts)} available orange shifts.`,
      );
      for (const shift of availableOrangeShifts) {
        if (shift.caption === "Kongress") {
          console.log(`FOUND TARGET: ID ${shift.id}.`);

          // --- NOW: PERFORM MANUAL BOOKING IN BROWSER ---
          // While this script runs, go to your browser and book an orange shift manually.
          // Watch the 'Network' tab. A new request WILL appear.
          // Share that Request URL and the Payload of THAT request with me.
        }
      }

      await page.waitForTimeout(60000);
    } catch (error) {
      console.error("Error in loop:", error);
      await page.waitForTimeout(10000);
    }
  }
}

runBot();
