// How many routs should we add to get in all airports from started airport?
// ROUTES work one way. For example ['DSM', 'ORD'] means way from DSM to ORD, not from ORD to DSM

const AIRPORTS = [
    'BGI', 'CDG', 'DEL', 'DOH', 'DSM', 'EWR', 'EYW', 'HND', 'ICN', 
    'JFK', 'LGA', 'LHR', 'ORD', 'SAN', 'SFO', 'SIN', 'TLV', 'BUD',]

const ROUTES = [
    ['DSM', 'ORD'],
    ['ORD', 'BGI'],
    ['BGI', 'LGA'],
    ['SIN', 'CDG'],
    ['CDG', 'SIN'],
    ['CDG', 'BUD'],
    ['DEL', 'DOH'],
    ['DEL', 'CDG'],
    ['TLV', 'DEL'],
    ['EWR', 'HND'],
    ['HND', 'ICN'],
    ['HND', 'JFK'],
    ['ICN', 'JFK'],
    ['JFK', 'LGA'],
    ['EYW', 'LHR'],
    ['LHR', 'SFO'],
    ['SFO', 'SAN'],
    ['SFO', 'DSM'],
    ['SAN', 'EYW'],
    //['LGA', 'TLV'],
    //['LGA', 'EWR'],
    //['LGA', 'EYW'],
]

STARTING_AIRPORT = 'LGA'

let routesFrom = {}
let routesTo = {}

ROUTES.forEach(airport => {
    if (routesFrom[airport[1]] === undefined) {
        routesFrom[airport[1]] = new Set([airport[0]])
    } else {
        routesFrom[airport[1]].add(airport[0])
    }
    if (routesTo[airport[0]] === undefined) {
        routesTo[airport[0]] = new Set([airport[1]])
    } else {
        routesTo[airport[0]].add(airport[1])
    }
})

function addAirports(routes, airport) {
    routes[airport].forEach(airportFromKey => {
        if (routes[airportFromKey]) {
            routes[airportFromKey].forEach(key => {
                if (!routes[airport].has(key)) {
                    routes[airport].add(key)
                }
            })
        }
    })
}

Object.keys(routesFrom).forEach(key => {
    addAirports(routesFrom, key)
})

Object.keys(routesTo).forEach(key => {
    addAirports(routesTo, key)
})

// let airportsCantBeReached = new Set()
// AIRPORTS.forEach(airport => {
//     if (!routesFrom[airport] && airport !== STARTING_AIRPORT) {
//         airportsCantBeReached.add(airport)
//     }
// })

let airportsCantBeReachedFromStarted = new Set()
AIRPORTS.forEach(airport => {
    if (airport !== STARTING_AIRPORT && (!routesFrom[airport] || !routesFrom[airport].has(STARTING_AIRPORT)))
        airportsCantBeReachedFromStarted.add(airport)
})

console.log('airportsCantBeReachedFromStarted', airportsCantBeReachedFromStarted)

let answer = []
function findAnswers(airports) {
    let longest = {distanations: new Set()}
    airports.forEach(key => {
        if (routesTo[key]?.size > longest.distanations.size) {
            longest = {name: key, distanations: routesTo[key]}
        }
    })
    
    answer.push(longest.name)

    let newAirports = new Set()
    airports.forEach(key => {
        if (!longest.distanations.has(key) && key !== longest.name) {
            newAirports.add(key)
        }
    })

    if (newAirports.size) {
        findAnswers(newAirports)
    }
}

findAnswers(airportsCantBeReachedFromStarted)

console.log('answer', answer)
