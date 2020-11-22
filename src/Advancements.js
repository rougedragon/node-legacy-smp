const fetch = require("node-fetch");
const cheerio = require('cheerio');

const CACHE_MINUTES = 15;
var cache = {};

module.exports = class Advancements {
    constructor() {}

    async fetchAdvancementsProgression() {
        return new Promise(async (resolve, reject) => {

            var now = new Date().getTime();
            if ( ('AdvancementsProgression' in cache) && ( (now - cache['AdvancementsProgression'].timestamp) < (CACHE_MINUTES * 60 * 1000) ) ) {
                resolve(cache['AdvancementsProgression'].content);
            }
            else { 
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

                cache['AdvancementsProgression'] = {
                    'timestamp': now,
                    'content': result
                }

                resolve(result);
            }
        });
    }
}