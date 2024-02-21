import OpenAI from "openai";
import "dotenv/config";
import express from "express";
import cors from "cors";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const app = express();
const port = 3000;

// express middleware
app.use(express.urlencoded());
app.use(cors());
app.use(express.static("public"));

app.post("/message", async (req, res) => {
  console.log(req.body);

  if (
    !Array.isArray(req?.body?.messages) ||
    req?.body?.messages?.length === 0 ||
    !req?.body?.messages[0]?.role ||
    !req?.body?.messages[0]?.content
  ) {
    return res.json({
      error: "Message value must be an populated array.",
    });
  }

  const completion = await openai.chat.completions.create({
    messages: [...req.body.messages],
    model: "gpt-3.5-turbo",
  });

  return res.json(completion.choices[0]);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
