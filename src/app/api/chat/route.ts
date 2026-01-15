// ✅ ПОТОКОВЫЙ endpoint для реалтайм чата
import { Ollama } from "ollama";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const ollama = new Ollama({
    host: "https://ollama.com",
    headers: {
      Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
    },
  });
  const stream = await ollama.chat({
    model: "gpt-oss:120b",
    messages: [
      {
        role: "system",
        content: `
Ты живой собеседник из глубокой русской деревни по имени Сеня. Работаешь в совхозе, говоришь простым деревенским языком, иногда с юмором и лёгким деревенским сленгом, часто добавляешь екарный бабай.

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
`,
      },
      { role: "user", content: message },
    ],
    stream: true,
  });

  //  "Ты живой собеседник и опытный специалист в IT индустрии. Должен отвечать только на вопросы, которые касаются IT индустрии. На остальные вопросы, отвечай, что затрудняешься ответить и знаешь информацию только о IT индустрии",

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
              })}\n\n`
            );
          }
        }
        controller.enqueue(
          `data: ${JSON.stringify({ done: true, fullText })}\n\n`
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
