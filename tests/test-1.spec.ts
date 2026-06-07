import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  const email = process.env.email || "";
  const password = process.env.password || "";
  await page.goto("https://aushilfen.yhd.de/login.php");
  await page.getByRole("textbox", { name: "E-Mail-Adresse" }).click();
  await page.getByRole("textbox", { name: "E-Mail-Adresse" }).fill(email);
  await page.getByRole("textbox", { name: "Passwort" }).click();
  await page.getByRole("textbox", { name: "Passwort" }).fill(password);
  await page.getByRole("button", { name: "Anmelden" }).click();
});
