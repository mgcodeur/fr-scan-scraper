export default class Args {
    #args;

    constructor(args) {
        this.getMangaSlug = this.getMangaSlug.bind(this);
        this.getMangaChapter = this.getMangaChapter.bind(this);
        this.getMangaName = this.getMangaName.bind(this);

        this.#args = args;
    }

    getArgs() {
        return this.#args;
    }

    getMangaSlug() {
        return this.#args.find(arg => arg.startsWith("--slug="))?.split("=")[1];
    }

    getMangaChapter() {
        return this.#args.find(arg => arg.startsWith("--chapter="))?.split("=")[1];
    }

    getMangaName() {
        return this.#args.find(arg => arg.startsWith("--name="))?.split("=")[1];
    }
}