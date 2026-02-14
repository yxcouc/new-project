
import { GoogleGenAI, Type } from "@google/genai";
import { Platform, ContentType } from "../types";

// 初始化 Gemini AI 客户端
// 密钥将严格从 process.env.API_KEY 获取，确保安全性
const ai = new GoogleGenAI({ 
  apiKey: process.env.API_KEY || '',
  // 如果您的网络环境需要使用 API 代理，可以在此配置 baseUrl
  // 例如: baseUrl: "https://your-custom-proxy.com/v1beta"
});

export const extractTaskFromImage = async (base64Image: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview', // 使用高性能且具备免费层级的 Flash 模型
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
    // Gemini 3 系列直接通过 .text 属性获取结果
    const textResult = response.text || '';
    return JSON.parse(textResult);
  } catch (error) {
    console.error("解析图片任务失败:", error);
    return null;
  }
};

/**
 * 智能解析文本中的链接，过滤掉多余的分享文案
 */
export const parseSmartLink = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  return match ? match[0] : '';
};
