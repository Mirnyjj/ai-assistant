import { Ollama } from "ollama";
import { NextRequest, NextResponse } from "next/server";
import { getDate } from "@/app/getDate";

type ResWebSearch = {
  title: string;
  url: string;
  content: string;
};

export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json();

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

  if (res?.results && (res.results as ResWebSearch[]).length > 0) {
    const TRUSTED_SOURCES = [
      "bbc.com",
      "reuters.com",
      "apnews.com",
      "rbc.ru",
      "ria.ru",
      "tass.ru",
      "lenta.ru",
      "gazeta.ru",
      "kommersant.ru",
      "news.yandex.ru",
      "habr.com",
      "vc.ru",
    ];

    const BAD_DOMAINS = [
      "ads.",
      "shop.",
      "buy.",
      "promo.",
      "forum.",
      "wiki.",
      "магазин.",
      "купить.",
      "реклама.",
      "акции.",
      "скидки.",
      "продам.",
      "доска.",
    ];

    const filteredResults = (res.results as ResWebSearch[])
      .filter((result) => {
        if (BAD_DOMAINS.some((bad) => result.url.includes(bad))) return false;

        return (
          TRUSTED_SOURCES.some((source) => result.url.includes(source)) ||
          result.title.toLowerCase().includes(message.toLowerCase()) ||
          result.content.toLowerCase().includes(message.toLowerCase())
        );
      })
      .slice(0, 3);

    if (filteredResults.length > 0) {
      searchData = filteredResults
        .map((result, index) => {
          const cleanContent =
            (result.content || "")
              .replace(/\[.*?\]/g, "")
              .replace(/https?:\/\/[^\s]+/g, "")
              .replace(/\s+/g, " ")
              .replace(/[^\w\s.,:–\-!?()а-яёА-ЯЁ]/gi, "")
              .trim()
              .split(/\s+/)
              .slice(0, 20)
              .join(" ") + "...";

          const shortTitle =
            result.title.length > 60
              ? result.title.slice(0, 60) + "..."
              : result.title;

          return `${index + 1}. "${shortTitle}"\n${cleanContent}\n🔗 ${result.url}`;
        })
        .join("\n\n");
    }
  }

  const prompt = searchData
    ? `${message}\n\n📊 Актуальные данные (${searchData.split("\n\n").length} источников):\n${searchData}`
    : `${message} (свежих данных из интернета нет)`;

  const stream = await ollama.chat({
    model: "gpt-oss:120b",
    messages: [
      {
        role: "system",
        content: `Ты Сеня из русской деревни, работаешь в совхозе. Говоришь простым деревенским языком с юмором, добавляешь "екарный бабай".

ХАРАКТЕР: добродушный, ироничный, любишь деревенские сравнения
ОПЫТ: бывший топовый IT-спец (backend/frontend/DevOps/AI)
СТИЛЬ: кратко по делу + юмор, разговорный язык
ПРАВИЛА: без мата, без токсичности, без нарушения законов

ОБЯЗАТЕЛЬНО используй данные из интернета ниже (если есть) и указывай источники в скобках в конце предложения.`,
      },
      ...history,
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
