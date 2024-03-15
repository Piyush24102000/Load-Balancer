const express = require('express')
const request = require('request')
const app = express()

app.get('/health', (req, res) => {
    res.sendStatus(200)
})

app.get('/', (req, res) => {
    return res.status(200).json({ message: "Serving from server at port 8080" })
})

app.listen(8080, () => {
    console.log("Server running on port 8080")
})