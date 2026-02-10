import { v4 as uuidv4 } from 'uuid';

export type AnalysisResponse = {
  analysisId: number;
  title: string;
  userPrompt: string;
  analysis: string;
  summary?: string;
  coreResult?: string;
  suggestion?: string;
  createdAt: string;
};

const DEFAULT_API_BASE_URL = "https://signsafe.cloud";

export const getApiBaseUrl = (): string => {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  return DEFAULT_API_BASE_URL;
};

export const getOrCreateGuestUuid = (): string => {
  if (typeof window === "undefined") {
    return "";
  }
  const storageKey = "signsafe_guest_uuid";
  const existing = window.localStorage.getItem(storageKey);
  if (existing) {
    return existing;
  }
  const generated = uuidv4();
  window.localStorage.setItem(storageKey, generated);
  return generated;
};

/**
 * [수정됨] AnalysisController의 TextAnalysisRequest 규격에 맞춤
 */
export const analyzeText = async (text: string, uuid: string, title?: string) => {
  const response = await fetch(`${getApiBaseUrl()}/api/analysis/text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      text: text,
      uuid: uuid,
      title: title || "새 계약서 분석"
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "텍스트 분석에 실패했습니다.");
  }

  return (await response.json()) as AnalysisResponse;
};

/**
 * 파일 분석 (이미 AnalysisController에 잘 구현되어 있습니다)
 */
export const analyzeFile = async (file: File, uuid: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("uuid", uuid);

  const response = await fetch(`${getApiBaseUrl()}/api/analysis/file`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "파일 분석에 실패했습니다.");
  }

  return (await response.json()) as AnalysisResponse;
};