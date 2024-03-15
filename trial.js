const express = require('express')
const request = require('request')
const app = express()
let backendServers = [
    { host: "http://localhost:8080", isHealthy: true },
    { host: "http://localhost:8081", isHealthy: true },
    { host: "http://localhost:8082", isHealthy: true },
]
let currentServerIndex = 0;


/* Function to check health of a server */
function healthCheck(server) {
    request(server.host + '/health', (err, res) => {
        if (!err && res.statusCode == 200) {
            server.isHealthy = true
            console.log(`Server ${server.host} is healthy`)
        }
        else {
            server.isHealthy = false
            console.log(`Server ${server.host} is unhealthy`)
        }
    })
}

/* Interval of 5 seconds */
setInterval(() => {
    backendServers.forEach((server) => {
        healthCheck(server)
    })
}, 5000)

/* Middleware */
app.use((req, res) => {

    /* Store Servers */
    let activeServers = []
    backendServers.forEach((server) => {
        if (server.isHealthy == true) {
            activeServers.push(server)
        }
    })

    /* Get individual server */
    let server = activeServers[currentServerIndex]
    if (server) {
        // Create a tunnel or pipe to send request n receive response
        req.pipe(request(server.host + req.url)).pipe(res)
    }
    // Move on to the next server
    currentServerIndex = (currentServerIndex + 1) % activeServers.length
})


app.listen(5000, () => { console.log("Load Balancer started on port 5000") })