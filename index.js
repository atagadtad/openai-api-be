import OpenAI from "openai";
import "dotenv/config";
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";

// DB
const db = new (sqlite3.verbose().Database)("./db.sqlite");

db.serialize(() => {
  db.prepare(`CREATE TABLE IF NOT EXISTS history (content TEXT)`)
    .run()
    .finalize();

  db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
    "history",
    (err, row) => console.log({ row })
  );

  // db.close();
});

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
  console.log("req.body: ", JSON.stringify(req.body));

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

  db.run(
    `INSERT INTO history (content) VALUES (?)`,
    [req.body.messages[0].content],
    (err) => {
      if (err) return console.log(err.message);
    }
  );

  const messages = db.all(`SELECT * FROM history`, [], (err, rows) => {
    if (err) return console.log(err.message);

    console.log({ rows });
  });

  // console.log({ messages });

  const completion = await openai.chat.completions.create({
    messages: [...req.body.messages],
    model: "gpt-3.5-turbo",
  });

  // console.log(completion.choices[0]);

  // res.json(completion.choices[0]);

  // const messages = [...req.body.messages, { ...completion.choices[0].message }]
  //   .map((message, index) => {
  //     if (message?.role === "assistant") return "";

  //     return `<input name="messages[][history]" disabled type="text" class="flex justify-end">${
  //       message?.content ?? "Cannot display user content"
  //     }</input>`;
  //   })
  //   .join("");

  // console.log({ messages });

  res.send("");

  // res.send(messages);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
