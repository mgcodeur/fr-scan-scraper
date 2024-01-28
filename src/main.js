import {scrapeMangaDetails} from "./pages/details/main.js";
import * as readline from "readline";
import Args from "./helpers/args.js";
import { scrapeChapters } from "./pages/chapters/main.js";

const args = (new Args(process.argv.slice(2)));

if (args.getArgs().length === 0) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Slug (ex: jujutsu-kaisen, solo-leveling): ", async (slug) => {
        rl.question("Chapter (if empty, all chapters will be downloaded): ", async (chapter) => {
            await scrapeMangaDetails(slug);
            await scrapeChapters(slug, chapter);
            rl.close();
        })
    });

    rl.on("close", () => {
        process.exit();
    });
}
else {
    const mangaSlug = args.getMangaSlug();
    await scrapeMangaDetails(mangaSlug);
    await scrapeChapters(mangaSlug, args.getMangaChapter());
    process.exit();
}
