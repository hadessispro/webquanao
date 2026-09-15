const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\thaibao\\.gemini\\antigravity\\brain\\2bb3742e-f229-4786-89d5-4009333a6b69';
const DOCS_ASSETS_DIR = path.join(__dirname, '..', 'public', 'docs-assets');

if (!fs.existsSync(DOCS_ASSETS_DIR)) {
  fs.mkdirSync(DOCS_ASSETS_DIR, { recursive: true });
}

async function saveScreenshot(page, filename) {
  const fullPathRepo = path.join(DOCS_ASSETS_DIR, filename);
  const fullPathArtifact = path.join(ARTIFACTS_DIR, filename);
  await page.screenshot({ path: fullPathRepo });
  fs.copyFileSync(fullPathRepo, fullPathArtifact);
  console.log('Saved screenshot:', filename);
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,960']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 960 });

    console.log('1. Logging into Admin...');
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });

    // Check if on login page
    const emailInput = await page.$('input[name="email"], input#field-email');
    if (emailInput) {
      await emailInput.type('temp_admin@test.com');
      const passInput = await page.$('input[name="password"], input#field-password');
      if (passInput) await passInput.type('TempPassword123!');
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
          submitBtn.click()
        ]);
      }
      await new Promise(r => setTimeout(r, 2000));
    }
    console.log('Admin logged in! Current URL:', page.url());

    // --- FEEDBACK 2 SCREENSHOTS ---
    console.log('2. Capturing Feedback 2: Product Collections...');
    await page.goto('http://localhost:3000/admin/collections/product-collections', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    await saveScreenshot(page, 'fb2_admin_collections_list.png');

    // Open first collection (or search coats-jackets)
    console.log('3. Opening a collection in Admin...');
    const firstRowLink = await page.$('tbody tr td a');
    if (firstRowLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        firstRowLink.click()
      ]);
      await new Promise(r => setTimeout(r, 2500));

      // Scroll to bottom CTA section
      await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('*'));
        const target = headings.find(el => el.textContent && el.textContent.includes('Khu vực nút kêu gọi hành động cuối trang'));
        if (target) {
          target.scrollIntoView({ behavior: 'instant', block: 'center' });
        } else {
          window.scrollTo(0, document.body.scrollHeight * 0.7);
        }
      });
      await new Promise(r => setTimeout(r, 1000));
      await saveScreenshot(page, 'fb2_admin_collection_bottom_cta.png');
    }

    page.setDefaultNavigationTimeout(60000);

    // Capture Storefront Collection Bottom CTA
    console.log('4. Capturing Storefront Collection Bottom CTA...');
    await page.goto('http://localhost:3000/collections/coats-jackets', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 3000));
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(r => setTimeout(r, 1500));
    await saveScreenshot(page, 'fb2_storefront_bottom_cta.png');

    // --- FEEDBACK 3 SCREENSHOTS ---
    console.log('5. Capturing Feedback 3: Product Admin Size Finder...');
    await page.goto('http://localhost:3000/admin/collections/products', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 3000));
    
    // Open product
    const productLink = await page.$('tbody tr td a');
    if (productLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
        productLink.click()
      ]);
      await new Promise(r => setTimeout(r, 4000));

      // Scroll to Size Finder section
      await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('*'));
        const target = headings.find(el => el.textContent && el.textContent.includes('Size Finder'));
        if (target) {
          target.scrollIntoView({ behavior: 'instant', block: 'start' });
        } else {
          window.scrollTo(0, document.body.scrollHeight * 0.45);
        }
      });
      await new Promise(r => setTimeout(r, 1500));

      // Select 'custom' in mode if not already selected so UI expands
      await page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        const modeSelect = selects.find(s => s.name && s.name.includes('sizeFinder.mode'));
        if (modeSelect) {
          modeSelect.value = 'custom';
          modeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      await new Promise(r => setTimeout(r, 2000));
      await saveScreenshot(page, 'fb3_admin_size_finder_custom.png');

      // Scroll slightly more to capture sizeRules form (Add row, height, weight, size)
      await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('*'));
        const target = headings.find(el => el.textContent && el.textContent.includes('Quy tắc gợi ý size'));
        if (target) {
          target.scrollIntoView({ behavior: 'instant', block: 'start' });
        } else {
          window.scrollBy(0, 450);
        }
      });
      await new Promise(r => setTimeout(r, 1500));
      await saveScreenshot(page, 'fb3_admin_size_rules_form.png');
    }

    // Storefront Product Detail Page - Size Finder Button & Modal
    console.log('6. Capturing Storefront Size Finder...');
    await page.goto('http://localhost:3000/products/hammer90sfitvnecksweater', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 3000));
    await saveScreenshot(page, 'fb3_storefront_product_page.png');

    // Click 'gợi ý size?'
    console.log('7. Opening Size Finder modal on Storefront...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent && b.textContent.includes('gợi ý size?'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    await saveScreenshot(page, 'fb3_storefront_size_finder_modal.png');

    console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
