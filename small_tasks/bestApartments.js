// Find appartments in block nearest to all facilities

let blocks = [
    {
        'gym': false,
        'shcool': true,
        'store': false
    },
    {
        'gym': true,
        'shcool': false,
        'store': false
    },
    {
        'gym': true,
        'shcool': true,
        'store': false
    },
    {
        'gym': false,
        'shcool': true,
        'store': false
    },
    {
        'gym': false,
        'shcool': true,
        'store': true
    },
    // {
    //     'gym': true,
    //     'shcool': false,
    //     'store': false
    // },
]

let distanses = []

function addDistances(blockIndex, siblingIndex) {
    if (distanses[blockIndex] === undefined) {
        distanses[blockIndex] = {sum: 0}
    }
    distanses[blockIndex].sum = 0;
    Object.keys(blocks[blockIndex]).forEach(key => {
        if (blocks[blockIndex][key] === true) {
            distanses[blockIndex][key] = 0
        } else if (blocks[siblingIndex] !== undefined) {
            if (distanses[blockIndex][key] === undefined || distanses[blockIndex][key] > distanses[siblingIndex][key] + 1) {
                distanses[blockIndex][key] = distanses[siblingIndex][key] + 1
            }
        } else if (distanses[blockIndex][key] === undefined) {
            distanses[blockIndex][key] = Infinity
        }
        distanses[blockIndex].sum += distanses[blockIndex][key]
    })
}

blocks.forEach((block, i) => {
    addDistances(i, i - 1)
})
console.log(distanses)

for (let i = blocks.length - 1; i >= 0; i--) {
    addDistances(i, i + 1)
}
console.log(distanses)
