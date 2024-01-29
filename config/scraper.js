const config = {
    maxWaitTime: 180000,
    frScan: {
        baseUrl: "https://fr-scan.com",
    },
    flareSolver: {
        baseUrl: "http://localhost:8191/v1"
    },
    browser: {
        headless: false,
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