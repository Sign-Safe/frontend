"use client";

import { useEffect, useState } from "react";

import type { AnalysisResponse } from "../lib/api";
import { analyzeText, getOrCreateGuestUuid } from "../lib/api";

interface TextInputPageProps {
  onAnalysisSuccess: (result: AnalysisResponse) => void;
  setIsAnalyzing: (loading: boolean) => void;
  setAnalysisError: (error: string) => void;
  isAnalyzing: boolean;
  analysisError: string;
  analysis?: string;
  analysisTitle?: string;
  analysisCreatedAt?: string;
  inputText?: string;
  onRunTextAnalysis?: (text: string) => Promise<void>;
}

const TextInputPage = ({
  onAnalysisSuccess,
  setIsAnalyzing,
  setAnalysisError,
  isAnalyzing,
  analysisError,
  analysis = "",
  analysisTitle = "",
  analysisCreatedAt = "",
  inputText = "",
  onRunTextAnalysis,
}: TextInputPageProps) => {
  const [text, setText] = useState<string>("");
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);

  useEffect(() => {
    if (inputText !== undefined) {
      setText(inputText);
    }
  }, [inputText]);

  // 분석 버튼을 눌렀을 때 실행되는 핵심 함수
  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert("계약 내용을 입력해주세요.");
      return;
    }

    // 버튼을 눌러 분석을 시작한 경우에만 결과 영역을 표시
    setHasAnalyzed(true);

    // 부모가 분석을 담당하면 그걸 사용(요구사항 변경 없이 페이지 내부 결과만 표시)
    if (onRunTextAnalysis) {
      await onRunTextAnalysis(text);
      return;
    }

    try {
      // 분석 시작 상태로 변경
      setIsAnalyzing(true);
      setAnalysisError("");

      // UUID 가져오기 (없으면 자동 생성됨)
      const uuid = getOrCreateGuestUuid();

      // 백엔드로 분석 요청 (POST)
      const result = await analyzeText(text, uuid, "텍스트 분석 요청");

      // 성공 시 부모 컴포넌트에 결과 전달 (ResultPage로 이동하기 위함)
      onAnalysisSuccess(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "분석 중 오류가 발생했습니다.";
      setAnalysisError(message);
    } finally {
      // 성공하든 실패하든 로딩 상태는 해제
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setText("");
    setAnalysisError("");
    setHasAnalyzed(false);
  };

  const displayDate = analysisCreatedAt ? new Date(analysisCreatedAt).toLocaleString() : "";

  return (
    <div className="text-input-page">
      <div className="text-input-container">
        <h2>계약서 텍스트 입력</h2>

        <div className="input-section">
          <label htmlFor="contract-text">계약 내용을 입력하세요:</label>
          <textarea
            id="contract-text"
            className="contract-textarea"
            placeholder="계약서의 내용을 복사하여 입력해주세요. 예: 갑은 을에게 변상금을 지급하지 않는다..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={15}
          />
        </div>

        <div className="button-group">
          <button className="btn btn-secondary" onClick={handleClear} disabled={isAnalyzing}>
            초기화
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !text.trim()}
          >
            {isAnalyzing ? "분석 중..." : "분석하기"}
          </button>
        </div>

        {analysisError && <div className="error-message">⚠️ {analysisError}</div>}

        {hasAnalyzed && analysis && (
          <div className="text-analysis-result">
            <section className="text-analysis-section">
              <h3>📊 분석 결과</h3>
              {analysisTitle && <p className="source-info">제목: {analysisTitle}</p>}
              {displayDate && <p className="source-info">분석 시각: {displayDate}</p>}
              <div className="content-display" style={{ whiteSpace: "pre-wrap" }}>
                {analysis}
              </div>
            </section>

            <section className="text-analysis-section">
              <h3>🔴 위험 조항</h3>
              <div className="content-display" style={{ whiteSpace: "pre-wrap" }}>
                {analysis}
              </div>
            </section>

            <section className="text-analysis-section">
              <h3>📝 원본 / 수정 제안</h3>
              <div className="text-two-column">
                <div className="text-column">
                  <h4>원본</h4>
                  <div className="content-display" style={{ whiteSpace: "pre-wrap" }}>
                    {text}
                  </div>
                </div>
                <div className="text-column">
                  <h4>수정 제안</h4>
                  <div className="content-display" style={{ whiteSpace: "pre-wrap" }}>
                    {analysis}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        <div className="info-section">
          <h3>✨ 이 도구는:</h3>
          <ul>
            <li>계약서의 잠재적인 위험 조항을 자동으로 탐지합니다</li>
            <li>일방적 손해배상 조항, 무제한 책임 등을 식별합니다</li>
            <li>계약 검토 시간을 단축하는데 도움을 줍니다</li>
            <li>
              모든 데이터는 UUID를 통해 비회원으로 안전하게 관리됩니다.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TextInputPage;
