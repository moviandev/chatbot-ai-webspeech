require('dotenv').config({ path: `${__dirname}/.env` });

const express = require('express');
const app = express();
const apiai = require('apiai')(process.env.API_AI_DEVELOPER_ACCESS_TOKEN);

app.use(express.static(`${__dirname}/views`)); // html
app.use(express.static(`${__dirname}/public`)); // js,css, imgs

const port = process.env.PORT || 3000;

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(
    'Express server listening on port %d in %s mode',
    server.address().port,
    app.settings.env,
  );
});

const io = require('socket.io')(server);
io.on('connection', (socket) => {
  socket.on('chat message', (text) => {
    // RECEBER RESPOSTA DO DIALOGFLOW
    console.log(text);
    let apiaiReq = apiai.textRequest(text, {
      sessionId: process.env.API_AI_DEVELOPER_ACCESS_TOKEN,
    });

    apiaiReq.on('response', (response) => {
      console.log(response);
      let aiText = response.result.fulfillment.speech;
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (err) => {
      console.error(err);
    });

    apiaiReq.end();
  });
});

app.get('/', (req, res) => {
  res.sendFile('index.html');
});
