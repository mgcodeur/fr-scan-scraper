import fetch from "node-fetch";
import {config} from "../../config/scraper.js";

const byPassCloudFlareAndReturnNewPage = async (context, browser, page, data) => {
    const flareSolverResponse = await fetchFlareSolverResponse(data);
    console.log(flareSolverResponse)
}

const getCookiesInResponse = (response) => (response.solution.cookies);

const fetchFlareSolverResponse = async (data) => {
    const request = await fetch(config.flareSolver.baseUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    });

    const flareSolverResponse = await request.json();

    if(flareSolverResponse.status !== 'ok') {
        throw new Error('FlareSolverr error');
    }

    return flareSolverResponse;
};

const getUserAgent = (response) => (response.solution.userAgent);

export { byPassCloudFlareAndReturnNewPage }