const fetch = require("node-fetch");
const cheerio = require('cheerio');
const { html } = require("cheerio");
const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();
let CACHE_MINUTES = 15;
var cache = {};
const urlAdvancementsCategories = {
    ADVANTURE: '2b68700a-9e86-4a4e-a5d4-a10fac65afa2',
    ANIMALS: 'c3092e78-fcbf-4b9e-a694-f1cf7538793f',
    BIOMES: '3311e127-8b25-40c2-89e2-8c5ac8d790f5',
    BLAZECAVE: '505e4cf9-8ed3-4693-a7ad-8398d3ff0d0d',
    BUILDING: '1773c945-f1cc-440e-b777-e7fb87e88754',
    CHALLENGES: '30ff2b25-e2dd-4b49-b565-721909612bd0',
    ENCHANTING: '5317e77d-c030-49ab-a4c1-5b02701733aa',
    END: '55f9ecb1-5c6b-4704-afd1-aaae5a3e3581',
    FARMING: '51550a44-a69b-4fdb-a24a-64dc6eb1cf18',
    HUSBANDRY: '09ae6525-5218-455e-9666-b86868ec57dd',
    MINING: '5b0e038b-b3fa-4b21-995d-d115c7e9da37',
    MONSTERS: 'fdf237f7-06c1-4c67-b3dd-a8786377cc75',
    NETHER: 'a123f16f-c0a7-4f92-903a-3a2362d80588',
    POTIONS: '91a85cc4-5cc8-49d0-8ba5-939360dd6aaf',
    REDSTONE: 'aa9d512a-f38c-4ad8-9d8d-8208b1d67ea9',
    STATISTICS: 'fedc8608-a46e-484a-b176-e7518faffc7e',
    STORY: 'b1dcea15-4440-4d80-9a99-b6f3490c203e',
    WEAPONRY: 'a4262668-bdee-41e8-99f4-52dc1a7eb43c'
}

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
    advancementCategories = {
        ADVENTURE: 'ADVANTURE',
        ANIMALS: 'ANIMALS',
        BIOMES: 'BIOMES',
        BLAZECAVE: 'BLAZECAVE',
        BUILDING: 'BUILDING',
        CHALLENGES: 'CHALLENGES',
        ENCHANTING: 'ENCHANTING',
        END: 'END',
        FARMING: 'FARMING',
        HUSBANDRY: 'HUSBANDRY',
        MINING: 'MINING',
        MONSTERS: 'MONSTERS',
        NETHER: 'NETHER',
        POTIONS: 'POTIONS',
        REDSTONE: 'REDSTONE',
        STATISTICS: 'STATISTICS',
        STORY: 'STORY',
        WEAPONRY: 'WEAPONRY'
    }

    async setCacheMinutes(minutes) {
        CACHE_MINUTES = minutes;
    }

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

    async fetchAdvancementCategory(category) {
        return new Promise(async (resolve, reject) => {

            var now = new Date().getTime();
            if ( (category in cache) && ( (now - cache[category].timestamp) < (CACHE_MINUTES * 60 * 1000) ) ) {
                resolve(cache[category].content);
            }
            else { 
                await this.loadAdvancementCategoryPage(category);
                resolve(cache[category].content);
            }
        });
    }

    async loadAdvancementCategoryPage(category) {
        var now = new Date().getTime();
        const res = await fetch(
            "https://legacysmp.com/categories/" + urlAdvancementsCategories[category],
            {
                method: "GET",
            }
        )
        const data = await res.text();
        let $ = cheerio.load(data);
        var completedAdvancements = [];
        var notCompletedAdvancements = [];
        for(var i = 1; i <= $('div .card').length; i++) {
            var advancementHtmlCard = $('div').find('.card:nth-child(' + i + ')');
            var advancementHtml = advancementHtmlCard.children('.card-body');

            var isCompleted = false;
            if(advancementHtml.find('p:nth-child(3)').html()) isCompleted = true;
            
            var advancementName = advancementHtml.children('h5').text();
            advancementName = htmlToText(advancementName);
            
            var advancementCondition = advancementHtml.children('.card-text').html();
            advancementCondition = htmlToText(advancementCondition);
            
            var advancement = null;
            if(isCompleted){
                var playerName = advancementHtml.find('p:nth-child(3)').children('small').children('a').children('img').attr('alt');
                var imageRef = 'https://legacysmp.com' + advancementHtml.find('p:nth-child(3)').children('small').children('a').children('img').attr('src');
                var timeCompleted = advancementHtml.find('p:nth-child(3)').children('small').text();

                advancement = {
                    completed: isCompleted,
                    name: advancementName,
                    condition: advancementCondition,
                    playerName: playerName,
                    imageRef: imageRef,
                    timeCompleted: timeCompleted
                }
            }
            else {
                advancement = {
                    completed: isCompleted,
                    name: advancementName,
                    condition: advancementCondition,
                }
            }


            
            if(isCompleted) completedAdvancements.push(advancement);
            else notCompletedAdvancements.push(advancement)
        }

        var content = {}
        content['completedAdvancements'] = completedAdvancements;
        content['notCompletedAdvancements'] = notCompletedAdvancements;

        cache[category] = {
            'timestamp': now,
            'content': content
        }
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