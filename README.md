# Node Legacy SMP

## Features

Get **advancements progression**

## Exemples

### Get advencements progression

```js
const LegacySMP = require("./index");
const LegacySMPAdvancements = new LegacySMP.Advancements

async function main() {
    advancements = await LegacySMPAdvancements.fetchAdvancementsProgression(); // Fetch advancements progression
    console.log(advancements);
    /*
    {
        percentage: '43.1%',
        completed: '352'
    }
    */
}

main();```