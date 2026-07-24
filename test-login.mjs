import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('response', response => {
    if (response.url().includes('_server') || response.status() === 500) {
      console.log(`[NETWORK] ${response.status()} ${response.url()}`);
      response.text().then(text => console.log(`[BODY] ${text}`)).catch(() => {});
    }
  });

  await page.goto('https://workmoniter.vercel.app/');
  
  console.log('Waiting for email input...');
  await page.waitForSelector('input[name="identifier"]');
  await page.fill('input[name="identifier"]', 'sreeram02420@gmail.com');
  await page.click('button.cl-formButtonPrimary');
  
  console.log('Waiting for password input...');
  await page.waitForSelector('input[name="password"]');
  await page.fill('input[name="password"]', 'Sreeram@007!');
  await page.click('button.cl-formButtonPrimary');
  
  console.log('Waiting for passcode screen...');
  await page.waitForTimeout(5000);
  
  console.log('Entering passcode...');
  // The passcode buttons are not standard inputs. Let's just click the numbers.
  // We can find them by text content.
  for (const num of ['1', '2', '3', '4']) {
    await page.click(`button:has-text("${num}")`);
    await page.waitForTimeout(500);
  }
  
  console.log('Waiting for response...');
  await page.waitForTimeout(5000);
  
  await browser.close();
})();
