import OpenAI from "openai";
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const app = express();
const port = 3000;

// express middleware
app.use(bodyParser.json());
app.use(cors());

app.post("/message", async (req, res) => {
  console.log(req.body);

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Hello world!" }],
    model: "gpt-3.5-turbo",
  });

  return res.json(completion.choices[0]);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
