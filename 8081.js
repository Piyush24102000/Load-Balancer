const express = require('express')
const request = require('request')
const app = express()

app.get('/health', (req, res) => {
    res.sendStatus(200)
})

app.get('/',(req,res) => {
    return res.status(200).json({message:"Serving from server at port 8081"})
})


app.listen(8081,() => {
    console.log("Server running on port 8081")
})