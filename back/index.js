const path = require('path')
const express = require('express')
const {Server} = require('ws')

const app = express();
app.use(express.static(path.join(__dirname, '..', 'front', 'build')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'front', 'build', 'index.html'))
})
app.listen(80, () => console.log('listening'));

const wss = new Server({
  port: 81,
})

let sheets = '';

wss.on('connection', websocket => {
  console.log('connected')
  websocket.id = Math.random();
  websocket.on('message', data => {
    sheets = data;
    sendSheets(websocket.id)
    console.log(data);
  })
})

function sendSheets(senderId) {
  for (let socket of wss.clients) {
    if (socket.id === senderId) continue;
    socket.send(sheets);
  }
}
