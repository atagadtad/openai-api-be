import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const main = async () => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Hello world!" }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
};

await main();
