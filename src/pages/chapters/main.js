import playwright from 'playwright';
import { config } from "../../../config/scraper.js";
import {downloadFile, getTimestamps} from "../../helpers/file.js";
import {getRandom} from "random-useragent";
import fetch from "node-fetch";

const scrapeChapters = async (slug, chapter) => {
    const browser = await playwright.chromium.launch(config.browser);
    const context = await browser.newContext({
        userAgent: getRandom()
    });

    const page = await context.newPage();

    await page.goto(`${config.frScan.baseUrl}/manga/${slug}/`, {
        timeout: config.maxWaitTime
    });

    await page.waitForLoadState('domcontentloaded', {
        timeout: config.maxWaitTime
    });

    await page.hover('#btn-read-last')

    const chapterRequest = await fetch(`${config.frScan.baseUrl}/manga/${slug}/ajax/chapters/`, {
        method: 'POST',
    });

    const chapterResponse = await chapterRequest.text();

    await page.setContent(chapterResponse);

    await page.screenshot({
        path: `screenshots/chapters/${getTimestamps()}-chapterlist.png`
    });

    await page.waitForSelector('.page-content-listing li a', {
        timeout: config.maxWaitTime
    });

    const chapterList = await page.evaluate(() => {
        const links = document.querySelectorAll('.page-content-listing li a');
        return Array.from(links).map((link) => link.getAttribute('href')).reverse();
    });

    await page.goto(chapterList[0], {
        timeout: config.maxWaitTime
    });


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