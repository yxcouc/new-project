
import { GoogleGenAI, Type } from "@google/genai";
import { Platform, ContentType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const extractTaskFromImage = async (base64Image: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: "Extract social media task details from this screenshot. Return JSON format with: platforms (array of strings, items must be one of: 抖音, 微博, 小红书, 视频号, 华为乾坤, 花粉俱乐部), title, types (array of strings, items one of: 图文, 视频), hashtags (array), quota (number), reward (string).",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
          title: { type: Type.STRING },
          types: { type: Type.ARRAY, items: { type: Type.STRING } },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          quota: { type: Type.NUMBER },
          reward: { type: Type.STRING }
        },
        required: ["platforms", "title", "types", "quota", "reward"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return null;
  }
};

export const parseSmartLink = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  return match ? match[0] : '';
};
