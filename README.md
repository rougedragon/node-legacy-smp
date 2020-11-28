# Node Legacy SMP

## Features

Get the **latest new advancement**\
Get the **advancement leaderboard**\
Get advancements by **category**\
Get **vote options**\
Get **previous** vote result

## Installing

```
npm i node-legacy-smp
```

## Examples

### Get advencements progression

```js
const LegacySMP = require("node-legacy-smp");
const LegacySMPAdvancements = new LegacySMP.Advancements();

async function main() {
    advancementsMainPage = await LegacySMPAdvancements.fetchAdvancementsProgression(); // Fetch advancements progression
    console.log(advancementsMainPage);
    /*
    {
        percentage: '49.6%',
        completed: '405',
        latestAdvancementTitle: "There's yolk on my head",
        latestAdvancementCondition: 'Catapult an egg onto a zombie&apos;s head',
        latestAdvancementPlayerName: 'PearlescentMoon',
        latestAdvancementPlayerImageRef: 'https://legacysmp.com/packs/media/images/avatars/100/pearlescentmoon-b6982f72e87c10427b18fd4ced6d2e35.png',
        latestAdvancementTimeCompleted: ' First accomplished about 19 hours ago'
        leaderboard : [{
            position: '1',
            name: 'MythicalSausage',
            imageRef: 'https://legacysmp.com/packs/media/images/avatars/100/mythicalsausage-dfe0cc0ed2a233147602ea48cc3af8ff.png',
            advancementsMade: '274'
        }...]
    }
    */

    
   console.log(advancementsMainPage.leaderboard[0]);
    /*{
        position: '1',
        name: 'MythicalSausage',
        imageRef: 'https://legacysmp.com/packs/media/images/avatars/100/mythicalsausage-dfe0cc0ed2a233147602ea48cc3af8ff.png',
        advancementsMade: '274'
    }*/
}

main();
```

### Get advancements by category

```js

const LegacySMP = require("node-legacy-smp");
const LegacySMPAdvancements = new LegacySMP.Advancements();
const categories = LegacySMPAdvancements.advancementCategories;

async function main() {
    adventureAdvancements = await LegacySMPAdvancements.fetchAdvancementCategory(categories.ADVENTURE);
    console.log(adventureAdvancements);
    /*
    {
        completedAdvancements: [
            {
                completed: true,
                name: 'Artillery',
                condition: 'Have nine loaded crossbows in your hotbar. All set!',
                playerName: 'JermsyBoy',
                imageRef: 'https://legacysmp.com/packs/media/images/avatars/100/jermsyboy-0af0472e653350ce26e99901b8294c41.png',
                timeCompleted: ' First accomplished 6 days ago
            },
            ...
        ],
        notCompletedAdvancements: [
            {
                completed: false,
                name: 'A Complete Catalogue',
                condition: 'Tame all cat variants!'
            },
            {
                completed: false,
                name: 'All chained up',
                condition: 'Trade for a piece of chain armor from an armorer villager'
            },
            ...
        ]
    }
    */
}

main();
```

```js

const LegacySMP = require("node-legacy-smp");
const LegacySMPAdvancements = new LegacySMP.Advancements();
const categories = LegacySMPAdvancements.advancementCategories;

async function main() {
    adventureAdvancements = await LegacySMPAdvancements.fetchAdvancementCategory(categories.ADVENTURE);
    console.log(adventureAdvancements.completedAdvancements[0]);
    /*
    {
        completed: true,
        name: 'Artillery',
        condition: 'Have nine loaded crossbows in your hotbar. All set!',
        playerName: 'JermsyBoy',
        imageRef: 'https://legacysmp.com/packs/media/images/avatars/100/jermsyboy-0af0472e653350ce26e99901b8294c41.png',
        timeCompleted: ' First accomplished 6 days ago'
    }
    */
}

main();

```

### Get vote options

```js
const LegacySMP = require("node-legacy-smp");
const LegacySMPVotes = new LegacySMP.Votes();

async function main() {
    var votePage = await LegacySMPVotes.fetchVotes();
    console.log(votePage.voteOptions)
    /*
    [
        {
            name: 'Drop Your Wallet!',
            description: 'Must carry all your diamonds on you at all times',
            votePercentage: 15.342465753424658,
            nbOfVotes: 56
        },
        {
            name: 'Face-Off',
            description: 'Always wear the last head you got as a drop',
            votePercentage: 10.41095890410959,
            nbOfVotes: 38
        }...
    ]
    */

   console.log(votePage.voteTimeLeft); // '14 days to go'
   console.log(votePage.nbOfVotes); // 362
   console.log(votePage.question); // 'Next vote...'
}

main();
```

### Get previous vote result

```js
const LegacySMP = require("node-legacy-smp");
const LegacySMPVotes = new LegacySMP.Votes();

async function main() {
    var votePage = await LegacySMPVotes.fetchVotes();
    console.log(votePage.previousResults)
    /*
    [
        {
            question: 'How evil do you feel?',
            name: 'Blood Nights',
            description: 'You must fight anyone you see at night.... to the death!',
            nbOfVotes: 5332,
            timeClosed: 'Closed about 11 hours ago'
        }
    ]
    */
}

main();
```