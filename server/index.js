const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/messageModel');
const app = express();
require('dotenv').config();
const openai = require('openai')(`${process.env.OPENAI_API_KEY}`);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/messages', async (req, res) => {
  const message = new Message({
    text: req.body.text
  });
  try {
    await message.save();
    const openaiResponse = await openai.completions.create({
      engine: 'davinci',
      prompt: req.body.text,
      maxTokens: 150,
      n: 1,
      stop: '\n',
      temperature: 0.7,
    });
    const responseText = openaiResponse.data.choices[0].text;
    const responseMessage = new Message({
      text: responseText
    });
    await responseMessage.save();
    res.status(201).json(responseMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
