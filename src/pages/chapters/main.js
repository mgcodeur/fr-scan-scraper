import playwright from 'playwright';
import { config } from "../../../config/scraper.js";
import {downloadFile} from "../../helpers/file.js";

const scrapeChapters = async (slug, chapter) => {
    const browser = await playwright.chromium.launch(config.browser);
    const page = await browser.newPage();

    await page.goto(`${config.frScan.baseUrl}/manga/${slug}/`, {
        timeout: config.maxWaitTime
    });

    await page.waitForLoadState('domcontentloaded', {
        timeout: config.maxWaitTime
    });

    await page.hover('#btn-read-last')

    await page.evaluate(() => {
        document.querySelector('#manga-chapters-holder').scrollIntoView({
            block: 'center',
        });
    });

    await page.waitForSelector('#manga-chapters-holder .page-content-listing li a', {
        timeout: config.maxWaitTime
    });

    const chapterList = await page.$$eval('#manga-chapters-holder .page-content-listing li a', (links) => {
        return links.map((link) => link.getAttribute('href')).reverse();
    });

    await page.click('#manga-chapters-holder .page-content-listing li:last-of-type a');

    await page.waitForSelector('.page-break', {
        timeout: config.maxWaitTime
    });

    for (const chapterLink of chapterList) {
        const currentChapterIndex = chapterList.indexOf(chapterLink);

        await page.goto(`${chapterLink}`, {
            timeout: config.maxWaitTime
        });

        const chapterPages = await page.$$eval(
            '.page-break img',
            (imgs) => imgs.map((img) => img.getAttribute('data-lazy-src'))
        );

        for (const url of chapterPages) {
            const index = chapterPages.indexOf(url);

            await downloadFile(
                url,
                `${config.output.path}/${slug}/chapters/${currentChapterIndex}/${index}.${config.file.image.extension}`
            );
        }
    }

    await page.close();
    await browser.close();
}

export { scrapeChapters };