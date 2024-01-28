const config = {
    maxWaitTime: 180000,
    frScan: {
        baseUrl: "https://fr-scan.com",
    },
    browser: {
        headless: true,
    },
    output: {
        path: "catalog"
    },
    file: {
        image: {
            extension: "webp"
        }
    }
}

export { config };