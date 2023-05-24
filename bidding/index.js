
const express = require('express')
const app =express()
const bodyParser = require('body-parser')
const userRouter = require('./app/model')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/users',userRouter)

const server = app.listen(3000,function(){

    var host = server.address().address
   var port = server.address().port 
   
   console.log("Example app listening at http://%s:%s", host, port)

});