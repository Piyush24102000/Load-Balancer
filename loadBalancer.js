const express = require('express')
const request = require('request')
const app = express()
const backendServers = [
    { host: 'http://localhost:8080', isHealthy: true }, //0
    { host: 'http://localhost:8081', isHealthy: true }, //1
    { host: 'http://localhost:8082', isHealthy: true }, //2
]
let currentServerIndex = 0

/* Health function */
function healthCheck(server) {
    request(server.host + '/health', (err, res) => {
        if(!err && res.statusCode == 200){
            server.isHealthy = true
            console.log(`Server ${server.host} is healthy`)
        }else{
            server.isHealthy = false
            console.log(`Server ${server.host} is unhealthy`)
        }
    })
}

/* Setinterval of 5 seconds */
setInterval(() => {
    backendServers.forEach((server) => {
        healthCheck(server)
    })
}, 5000)

/* Middleware */
app.use((req, res) => {
    let activeServers = []
    backendServers.forEach((server) => {
        if (server.isHealthy == true) {
            activeServers.push(server)
        }
    })

    let currServer = activeServers[currentServerIndex]
    if (currServer) {
        req.pipe(request(currServer.host + req.url)).pipe(res)
    }

    // Move on to the next server
    currentServerIndex = (currentServerIndex + 1) % activeServers.length

})

app.listen(5000, () => {
    console.log("Load balancer running on port 5000")
})