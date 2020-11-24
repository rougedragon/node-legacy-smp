const fetch = require("node-fetch");
const cheerio = require('cheerio');
const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();
const CACHE_MINUTES = 15;
var cache = {};

function htmlToText(html){
    var html2 = html.replace(/<style([\s\S]*?)<\/style>/gi, '')
    .replace(/<script([\s\S]*?)<\/script>/gi, '')
    .replace(/<\/div>/ig, '\n')
    .replace(/<\/li>/ig, '\n')
    .replace(/<li>/ig, '  *  ')
    .replace(/<\/ul>/ig, '\n')
    .replace(/<\/p>/ig, '\n')
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<[^>]+>/ig, '');
    html2 = entities.decode(html2);
    return html2;
}

module.exports = class Advancements {
    constructor() {}

    async fetchAdvancementsProgression() {
        return new Promise(async (resolve, reject) => {

            var now = new Date().getTime();
            if ( ('AdvancementsProgression' in cache) && ( (now - cache['AdvancementsProgression'].timestamp) < (CACHE_MINUTES * 60 * 1000) ) ) {
                resolve(cache['AdvancementsProgression'].content);
            }
            else { 
                await this.loadMainPageAdvancements();
                resolve(cache['AdvancementsProgression'].content);
            }
        });
    }

    async loadMainPageAdvancements() {
        var now = new Date().getTime();
        const res = await fetch(
            "https://legacysmp.com/advancements",
            {
                method: "GET",
            }
        )
        const data = await res.text();
        let $ = cheerio.load(data);
        let pourcentage = $('h2');
        let advancementsCompleted = $('strong');
        let latestAdvancementDiv = $('.latest');
        let latestAdvancementTitle = latestAdvancementDiv.children('.card').children('.card-body').children('.card-title').text();
        let latestAdvancementCondition = latestAdvancementDiv.children('.card').children('.card-body').children('.card-text').html();
        let latestAdvancementPlayerName = latestAdvancementDiv.children('.card').children('.card-body').children('.card-text').last().children('small').children('a').children('img').attr('alt');
        let latestAdvancementPlayerImageRef = 'https://legacysmp.com' + latestAdvancementDiv.children('.card').children('.card-body').children('.card-text').last().children('small').children('a').children('img').attr('src');
        let latestAdvancementTimeCompleted = latestAdvancementDiv.children('.card').children('.card-body').children('.card-text').last().children('small').text();
        latestAdvancementTitle = htmlToText(latestAdvancementTitle);
        latestAdvancementCondition = htmlToText(latestAdvancementCondition);


        let leaderboardHtml = $('.table').children('tbody');
        let leaderboard = [];
        for(var i = 1; i < 16; i++){
            let leaderboardPlayerHtml = leaderboardHtml.find('tr:nth-child('+ i + ')');
            let position = leaderboardPlayerHtml.children('th').text();
            let name = leaderboardPlayerHtml.children('td').children('a').children('img').attr('alt');
            let imageRef = 'https://legacysmp.com' + leaderboardPlayerHtml.children('td').children('a').children('img').attr('src');
            let advancementsMade = leaderboardPlayerHtml.children('.text-right').text();
            let leaderboardPlayer = {
                'position': position,
                'name': name,
                'imageRef': imageRef,
                'advancementsMade': advancementsMade
            }
            leaderboard.push(leaderboardPlayer);
        }

        var content = {};
        content['percentage'] = pourcentage.text();
        content['completed'] = advancementsCompleted.text().substr(0,advancementsCompleted.text().indexOf(' '));
        content['latestAdvancementTitle'] = latestAdvancementTitle;
        content['latestAdvancementCondition'] = latestAdvancementCondition;
        content['latestAdvancementPlayerName'] = latestAdvancementPlayerName;
        content['latestAdvancementPlayerImageRef'] = latestAdvancementPlayerImageRef;
        content['latestAdvancementTimeCompleted'] = latestAdvancementTimeCompleted;
        content['leaderboard'] = leaderboard;

        cache['AdvancementsProgression'] = {
            'timestamp': now,
            'content': content
        }
    }
}