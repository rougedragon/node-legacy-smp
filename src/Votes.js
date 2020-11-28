const fetch = require("node-fetch");
const cheerio = require('cheerio');
const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();
const CACHE_MINUTES = 15;
cache = {};

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

module.exports = class Votes {
    constructor() {}

    async fetchVotes() {
        return new Promise(async (resolve, reject) => {

            var now = new Date().getTime();
            if ( ('votes' in cache) && ( (now - cache['votes'].timestamp) < (CACHE_MINUTES * 60 * 1000) ) ) {
                resolve(cache['votes'].content);
            }
            else { 
                await this.loadVotesPage('votes');
                resolve(cache['votes'].content);
            }
        });
    }

    async loadVotesPage() {

        var now = new Date().getTime();
        const res = await fetch(
            "https://legacysmp.com/topics",
            {
                method: "GET",
            }
        )
        const data = await res.text();
        let $ = cheerio.load(data);
        
        let voteOptions = [];
        let voteOptionsHtml = $('.topic').children('.card-group');
        for(var i = 1; i < voteOptionsHtml.children().length + 1; i++) {
            let voteOption = voteOptionsHtml.find('.option:nth-child('+ i + ')').children('.card-body');
            let name = voteOption.children('.card-title').text();
            name = htmlToText(name);

            let description = voteOption.children('.card-text').text();
            description = htmlToText(description);

            let votePercentage = parseFloat(voteOption.children('.mt-auto').children('.progress').children('.progress-bar').attr('aria-valuenow'));
            let nbOfVotes = voteOption.children('.mt-auto').children('.card-text').children('small').text();
            nbOfVotes = nbOfVotes.substring(
                nbOfVotes.lastIndexOf("(") + 1, 
                nbOfVotes.lastIndexOf(" ")
            );
            nbOfVotes = nbOfVotes.replace(/,/gi,'');
            nbOfVotes = parseInt(nbOfVotes);
            
            let vote = {
                name: name,
                description: description,
                votePercentage: votePercentage,
                nbOfVotes: nbOfVotes
            }
            voteOptions.push(vote);
        }

        let voteTimeLeft = $('.topic').children('.time_remaining').text();
        voteTimeLeft = voteTimeLeft.substring(
            5,
            voteTimeLeft.indexOf(".")
        );

        let nbOfVotes = $('.topic').children('.time_remaining').text();
        nbOfVotes = nbOfVotes.substring(
            nbOfVotes.indexOf(".") + 2,
            nbOfVotes.indexOf("v") - 1
        );
        nbOfVotes = nbOfVotes.replace(/,/gi,'');
        nbOfVotes = parseInt(nbOfVotes);

        let question = $('.topic').children('.question').text();
        question = question.replace(/  /gi, '');
        question = question.replace(/\n/gi, '');

        let previousResults = []

        for(var i = 1; i < $('.row-cols-md-2').children('closed').children.length + 1; i++){
            let voteHtml = $('.row-cols-md-2').children('.col').children('.card');
            let question = voteHtml.children('.card-header').text();
            question = question.replace(/  /gi, '');
            question = question.replace(/\n/gi, '');
            question = htmlToText(question)
            
            let name = voteHtml.children('.card-body').children('.card-title').text();
            name = htmlToText(name);
            
            let description = voteHtml.children('.card-body').children('.card-text:nth-child(2)').text();
            description = htmlToText(description);

            let nbOfVotes = voteHtml.children('.card-body').children('.card-text:nth-child(3)').children('small').text();
            nbOfVotes = nbOfVotes.substring(
                nbOfVotes.lastIndexOf("(") + 1, 
                nbOfVotes.lastIndexOf(" ")
            );
            nbOfVotes = nbOfVotes.replace(/,/gi,'');
            nbOfVotes = parseInt(nbOfVotes);
            
            let timeClosed = voteHtml.children('.card-footer').text();
            timeClosed = timeClosed.replace(/  /gi, '');
            timeClosed = timeClosed.replace(/\n/gi, '');
            timeClosed = htmlToText(timeClosed);
            
            let previousVote = {
                question: question,
                name: name,
                description: description,
                nbOfVotes: nbOfVotes,
                timeClosed: timeClosed
            }
            previousResults.push(previousVote);
        }
        
        var content = {};
        content['voteOptions'] = voteOptions;
        content['voteTimeLeft'] = voteTimeLeft;
        content['nbOfVotes'] = nbOfVotes;
        content['question'] = question;
        content['previousResults'] = previousResults;

        cache['votes'] = {
            'timestamp': now,
            'content': content
        }

    }

}