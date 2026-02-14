
import { GoogleGenAI, Type } from "@google/genai";
import { Platform, ContentType } from "../types";

// 初始化 Gemini AI 客户端
const ai = new GoogleGenAI({ 
  apiKey: process.env.API_KEY || '',
  baseUrl: "https://gemini-proxy.yxcouc.workers.dev/v1beta" 
});

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
          text: `你是一个社交媒体任务助理。请从这张截图中提取任务信息。
          要求：
          1. 识别发布平台（如：抖音, 微博, 小红书, 视频号, 华为乾坤, 花粉俱乐部）。
          2. 提取任务标题（中文）。
          3. 识别内容形式（图文 或 视频）。
          4. 提取必带的话题标签（Hashtags）。
          5. 提取任务名额/数量。
          6. 提取奖励描述（如：xx元/条，或 积分奖励）。
          
          请严格以 JSON 格式返回。`,
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
    const textResult = response.text || '';
    return JSON.parse(textResult);
  } catch (error) {
    console.error("解析图片任务失败:", error);
    return null;
  }
};

export const parseSmartLink = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  return match ? match[0] : '';
};
