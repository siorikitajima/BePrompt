const http = require("http");
const { render } = require('ejs');
const express = require("express");
const app = express();
const intRoutes = require('./routes/intRoutes');
const translate = require("deepl");
const dotenv = require('dotenv');
dotenv.config();

app.use(express.static("public"));
app.set('view engine', 'ejs');

const serverPort = 3120;
const server = http.createServer(app);

const WebSocket = require("ws");
const e = require("express");
let keepAliveId;
const wss = new WebSocket.Server({ server });
server.listen(serverPort, () => console.log(`Omar listening on ${serverPort}`));


// Default Prompt when WS server starts
const defaultPrompt = {Type: 'Be', Prompt:"Poison Gas Attack, Genocide, White Phosphorus", Category: "System", Music: "system-01", StyleArtist1: "zdzisław-beksinski", StyleArtist2: "kazuo-umezu", StyleArtist3: "gothic-art"}
// {Prompt: 'patterns and codes and fractals bubbles and partic…and smoke and dustand infinity and solar eclipses', Category: 'Life', Audio: 'Joseph Minadeo - LCUBB2 - 01 Who You Are', Artist: 'LCUBB2', Japanese: 'パターン模様、プログラミングコード、フラクタルの泡や粒子、煙や塵、無限と日食'}

// let kidsPrompt = {Type: 'Kids', Prompt: "A fluffy rabbit wearing a colorful scarf, hopping through a magical candy forest with rainbow trees and cotton candy clouds.", Music: "system-01"};

let latestPrompt = defaultPrompt;
// let lastKidsPrompt = kidsPrompt;

wss.on("connection", function (ws, req) {
  console.log("Connection Opened");
  console.log("Client size: ", wss.clients.size);
  if (wss.clients.size === 1) {
    console.log("first connection. starting keepalive");
    keepServerAlive();
  }
  // WS message event
  ws.on("message", (data) => {
    function isJson(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }  
      return true;
    }

    if(!isJson(data)) {
      let stringifiedData = data.toString();
      if (stringifiedData === 'pong') {
        console.log('keepAlive');
      }
      return;
    } else {
      // Parse data to check if it's a request or a prompt
      let parsedData = JSON.parse(data);
      console.log(parsedData);
      // If WS is open and a request is made, send the latest prompt
        if (parsedData.Requested === true) {
        broadcast(ws, JSON.stringify(latestPrompt), true);
        console.log('requested');
        return;
        } else if (parsedData.Type == "Kids") {
          broadcast(ws, JSON.stringify(parsedData), false);
          // lastKidsPrompt = parsedData;

      // If an English custom prompt is sent, translate it and broadcast it
      // } else if (parsedData.EnglishCustom !== undefined) {
      //   translate({
      //     free_api: true,
      //     text: parsedData.EnglishCustom,
      //     source_lang: 'EN',
      //     target_lang: 'JA',
      //     auth_key: process.env.DEEPL_API_KEY,
      //   })
      //   .then(result => {
      //       translatedData = {
      //         EnglishCustom: parsedData.EnglishCustom,
      //         TranslatedJA: result.data.translations[0].text,
      //       }
      //       broadcast(ws, JSON.stringify(translatedData), true);
      //       latestPrompt.Japanese = result.data.translations[0].text;
      //       latestPrompt.Prompt = parsedData.EnglishCustom;
      //       latestPrompt.Category = 'Custom';
      //   })
      //   .catch(error => {
      //       console.error(error)
      //   });
      //   return;
      // // If a Japanese custom prompt is sent, translate it and broadcast it
      // } else if (parsedData.JapaneseCustom !== undefined) {
      //   translate({
      //     free_api: true,
      //     text: parsedData.JapaneseCustom,
      //     source_lang: 'JA',
      //     target_lang: 'EN',
      //     auth_key: process.env.DEEPL_API_KEY,
      //   })
      //   .then(result => {
      //       translatedData = {
      //         TranslatedEN: result.data.translations[0].text,
      //         JapaneseCustom: parsedData.JapaneseCustom,
      //       }
      //       broadcast(ws, JSON.stringify(translatedData), true);
      //       latestPrompt.Prompt = result.data.translations[0].text;
      //       latestPrompt.Japanese = parsedData.JapaneseCustom;
      //       latestPrompt.Category = 'Custom';
      //   })
      //   .catch(error => {
      //       console.error(error)
      //   });
      //   return;
      } else {
        // If it's a prompt, broadcast it
        broadcast(ws, JSON.stringify(parsedData), false);
        latestPrompt = parsedData;
      }
    }

  });

  ws.on("close", (data) => {
    console.log("closing connection");
    if (wss.clients.size === 0) {
      console.log("last client disconnected, stopping keepAlive interval");
      clearInterval(keepAliveId);
    }
  });
});

// Implement broadcast function
const broadcast = (ws, message, includeSelf) => {
  if (includeSelf) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  } else {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
};

// Sends a ping message to all connected clients every 50 seconds
 const keepServerAlive = () => {
  keepAliveId = setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send('ping');
      }
    });
  }, 50000);
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(intRoutes);