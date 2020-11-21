#Node Legacy SMP

##Features

Get **advancement progression**

##Exemples

###Get advencements progress

```const LegacySMP = require("./index");
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