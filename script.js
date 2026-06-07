// if its already registered then its angemeldet as 1 otherwise 0 and if its closed then its closed as 1 otherwise 0 and if its open then its offen as 1
// this is the website to get data :
// this is the api https://aushilfen.yhd.de/functionen/get_event.php where POST request is used
// https://aushilfen.yhd.de/index.phpawait page.getByRole('textbox', { name: 'E-mail address' }).fill('talhajameel15@gmail.com');
await page.getByRole("textbox", { name: "password" }).click();
await page.getByRole("textbox", { name: "password" }).fill("Uni..0296!!");
await page.getByRole("button", { name: "Register" }).click();
await page
  .locator("a")
  .filter({ hasText: ":00 - 02:30 (8:30 h) Kongress" })
  .nth(1)
  .click();
await page.locator("label").click();
await page.getByRole("button", { name: "Close modal" }).click();
