import playwright from 'playwright';
import { config } from "../../../config/scraper.js";
import { trimAndRemoveMultipleSpaces } from "./../../helpers/string.js";
import {downloadFile, getTimestamps, saveInJsonFile} from "./../../helpers/file.js";
import { cleanObject } from "./../../helpers/object.js";
import {getRandom} from "random-useragent";

const scrapeMangaDetails = async (slug) => {
    const browser = await playwright.chromium.launch(config.browser);

    const context = await browser.newContext({
        userAgent: getRandom()
    });

    const page = await context.newPage();

    page.__proto__.getMangaDetailByXPath = async (text) => {
        return await page.$eval(
            `//*[contains(text(), "${text}")]`,
            (el) => el ? el.parentElement?.nextElementSibling?.textContent?.trim()?.replace(/\s+/g, ' ') : ''
        );
    }


    await page.goto(`${config.frScan.baseUrl}/manga/${slug}/`, {
        timeout: config.maxWaitTime
    });

    await page.screenshot({
        path: `screenshots/details/${getTimestamps()}-detail.png`
    });

    await page.waitForSelector(".post-title h1", {
        timeout: config.maxWaitTime
    });

    const mangaDetails = {
        slug: slug,
        title: trimAndRemoveMultipleSpaces(
            await page.$eval(".post-title h1", (el) => el.textContent)
        ),
        rating: trimAndRemoveMultipleSpaces(
            await page.$eval(".post-total-rating", (el) => el.textContent)
        ),
        alternativeTitle: await page.getMangaDetailByXPath("Alternative(s)"),
        authors: await page.getMangaDetailByXPath("Auteur(s)"),
        artists: await page.getMangaDetailByXPath("Artiste(s)"),
        genders: await page.getMangaDetailByXPath("Genre(s)"),
        synopsis: trimAndRemoveMultipleSpaces(
            await page.$eval('.summary__content', (el) => el.textContent)
        ),
    };

    const imageUrl = await page.$eval(".summary_image img", (el) => el.src);

    const imageName = getTimestamps();
    await downloadFile(
        imageUrl,
        `./${config.output.path}/${slug}/details/${imageName}.${config.file.image.extension}`
    );

    mangaDetails.image = `${imageName}.${config.file.image.extension}`;

    await saveInJsonFile(
        cleanObject(mangaDetails),
        `./${config.output.path}/${slug}/details/detail.json`
    );

    await page.close();
    await context.close();
    await browser.close();
}

export { scrapeMangaDetails };