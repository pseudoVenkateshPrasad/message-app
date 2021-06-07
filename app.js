const express = require('express')
const port = 3000
const routes = require('./routes/user')
const db = require('./mongoose.js')
const chatModel = require('./model.js')
const app = express()
const http = require('http');
const server = http.createServer(app);




app.use(express.urlencoded());
app.set('view engine', 'ejs')
app.set('views')


app.use(express.static('public'))

app.get('/', routes)
app.post('/register', routes)
app.get('/signin', routes)
app.post('/signin', routes)
app.get('/profile', routes)
app.get('/logout', routes)



server.listen(port, () => {
    console.log(`Listening to the port ${port}`)
})

// Socket Connection

const io = require('socket.io')(server)

io.on('connection', (socket) => {
    console.log("connected to socket io engine...")

    socket.on('message', (msg) => {
        console.log(msg)

        socket.broadcast.emit('message', msg)
    })
})

