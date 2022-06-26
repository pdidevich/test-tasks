// 1 - earth
// 0 - water
// Find all earth not connected with borders of map

const MAP_ = [
    [1, 0, 0, 1, 0, 0],
    [0, 1, 1, 0, 1, 1],
    [0, 0, 1, 0, 1, 0],
    [1, 1, 0, 0, 1, 0],
    [1, 0, 1, 1, 0, 0],
    [1, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 0, 1],
    [1, 1, 0, 0, 1, 1],
]
const MAP_Y_LENGTH = MAP_.length - 1
const MAP_X_LENGTH = MAP_[0].length - 1
const Y_BORDERS = [0, MAP_Y_LENGTH]
const X_BORDERS = [0, MAP_X_LENGTH]

let mainland = [];
MAP_.forEach((Y, y) => {
    mainland[y] = []
})

function checkSiblings(x, y) {
    if (y > 1) {
        checkArea(x, y - 1)
    }
    if (x < MAP_X_LENGTH - 1) {
        checkArea(x + 1, y)
    }
    if (y < MAP_Y_LENGTH - 1) {
        checkArea(x, y + 1)
    }
    if (x > 1) {
        checkArea(x - 1, y)
    }
}

function checkArea(x, y) {
    if (mainland[y][x] !== undefined)
        return
    mainland[y][x] = MAP_[y][x]
    if (mainland[y][x] === 1) {
        checkSiblings(x, y)
    }
}

Y_BORDERS.forEach(i => {
    MAP_[i].forEach((X, x) => {
        checkArea(x, i)
    })
})

X_BORDERS.forEach(i => {
    MAP_.forEach((Y, y) => {
        checkArea(i, y)
    })
})

console.log(mainland)
