const { chromium } = require("@playwright/test");

async function runBot() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Starting initial login...");
  await page.goto("https://aushilfen.yhd.de/login.php");
  await page
    .getByRole("textbox", { name: "E-Mail-Adresse" })
    .fill(process.env.email);
  await page
    .getByRole("textbox", { name: "Passwort" })
    .fill(process.env.password);
  await page.getByRole("button", { name: "Anmelden" }).click();
  await page.waitForLoadState("networkidle");
  console.log("Login successful!");

  let weeklyShiftCount = 0;

  while (true) {
    try {
      // Fetch available shifts
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

      // Reset logic: In a real production bot, you'd reset weeklyShiftCount
      // based on the date, but for now we track current session count.
      if (weeklyShiftCount >= 5) {
        console.log("Weekly target of 5 shifts reached. Pausing...");
        await page.waitForTimeout(60000);
        continue;
      }

      const availableOrangeShifts = shifts.filter(
        (s) => s.className?.includes("termin_orange") && s.offen === 1,
      );

      for (const shift of availableOrangeShifts) {
        const shiftDate = new Date(shift.start);
        const dayOfWeek = shiftDate.getDay(); // 0=Sun, 4=Thu

        // Logic: Skip Thursdays, ensure target criteria
        if (dayOfWeek === 4) continue;

        console.log(
          `Attempting to book shift ID: ${shift.id} on ${shift.start}`,
        );

        // Perform the booking POST request
        const bookingResponse = await page.request.post(
          "https://aushilfen.yhd.de/index.php",
          {
            form: {
              op: "anmelden",
              Bedarf_id: shift.id,
            },
          },
        );

        if (bookingResponse.ok()) {
          console.log(`Successfully booked shift ${shift.id}`);
          weeklyShiftCount++;
        }
      }

      // 3-second refresh delay
      await page.waitForTimeout(3000);
    } catch (error) {
      console.error("Error in loop:", error);
      await page.waitForTimeout(5000);
    }
  }
}

runBot();
