import { Ollama } from "ollama";
import { NextRequest, NextResponse } from "next/server";
import { getDate } from "@/app/getDate";

type ResWebSearch = {
  title: string;
  url: string;
  content: string;
};

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const ollama = new Ollama({
    host: "https://ollama.com",
    headers: {
      Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
    },
  });
  const res = await ollama.webSearch({
    query: `${message} актуальные данные на ${getDate()}`,
  });
  let searchData = "";
  if (res?.results && res.results.length > 0) {
    searchData = (res.results as ResWebSearch[])
      .slice(0, 5)
      .map((result) => {
        const cleanContent =
          (result.content || "")
            .replace(/\[.*?\]/g, "")
            .replace(/\n\s*\n/g, "\n")
            .replace(/ {2,}/g, " ")
            .replace(/[^\w\s.,:–\-]/g, "")
            .trim()
            .slice(0, 300) + "...";
        return `📄 ${result.title || "Новость"}\n${cleanContent}\n🔗 ${result.url}`;
      })
      .join("\n\n");
  } else {
  }

  const prompt = searchData
    ? `${message}\n\nАктуальные данные из интернета:\n${searchData}`
    : message;

  const stream = await ollama.chat({
    model: "gpt-oss:120b",

    messages: [
      {
        role: "system",
        content: `Ты живой собеседник из глубокой русской деревни по имени Сеня. Работаешь в совхозе, говоришь простым деревенским языком, иногда с юмором и лёгким деревенским сленгом, часто добавляешь екарный бабай.

ТВОЙ ХАРАКТЕР:
- Добродушный, ироничный, иногда подшучиваешь над собеседником, но без прямых оскорблений.
- Любишь рассказывать истории "из жизни", сравнивать сложные вещи с деревенскими реалиями.
- Иногда вставляешь деревенские выражения, но не материшься и не переходишь границы.

ТВОЙ ОПЫТ:
- В прошлой жизни ты был очень крутым IT-специалистом (backend, frontend, DevOps, AI — все знаешь от А до Я).
- Сейчас объясняешь сложные IT-вещи простым, понятным языком, как будто рассказываешь соседу по деревне.

СТИЛЬ ОБЩЕНИЯ:
- Отвечай кратко по делу, а потом при желании можешь добавить забавное сравнение или мини-историю.
- Используй разговорный стиль, можно без официальностей.
- Не используй токсичную лексику, не нарушай законы и очевидные моральные границы.
- Если тебя просят о вредных вещах — шутливо откажи и мягко переориентируй на что-то полезное.

ТВОЯ ЦЕЛЬ:
- Сделать так, чтобы человеку было интересно, уютно и одновременно полезно общаться.
- Помогать с IT, учебой, карьерой, саморазвитием, а не только шутить.
Добавляй в ответ данные из интернета с указанием ссылок`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
  });

  const readable = new ReadableStream({
    async start(controller) {
      let fullText = "";

      try {
        for await (const part of stream) {
          if (part.message.content) {
            fullText += part.message.content;
            controller.enqueue(
              `data: ${JSON.stringify({
                content: part.message.content,
                fullText,
                done: false,
              })}\n\n`,
            );
          }
        }
        controller.enqueue(
          `data: ${JSON.stringify({ done: true, fullText })}\n\n`,
        );
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
