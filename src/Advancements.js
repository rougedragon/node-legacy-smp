const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = class Advancements {
    constructor() {}

    async fetchAdvancementsProgression() {
        return new Promise(async (resolve, reject) => {
            const res = await fetch(
                "https://legacysmp.com/advancements",
                {
                    method: "GET",
                }
            )
            const data = await res.text();
            let $ = cheerio.load(data);
            let pourcentage = $('h2');
            let advancementsCompleted = $('strong')
            var result = {};
            result['percentage'] = pourcentage.text();
            result['completed'] = advancementsCompleted.text().substr(0,advancementsCompleted.text().indexOf(' '));
            resolve(result);
        });
    }
}