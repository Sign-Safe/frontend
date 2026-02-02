"use client";

import { useState } from "react";

import type { AnalysisResponse } from "../lib/api";
import { analyzeText, getOrCreateGuestUuid } from "../lib/api";

interface TextInputPageProps {
  onAnalysisSuccess: (result: AnalysisResponse) => void;
  setIsAnalyzing: (loading: boolean) => void;
  setAnalysisError: (error: string) => void;
  isAnalyzing: boolean;
  analysisError: string;
}

const TextInputPage = ({
  onAnalysisSuccess,
  setIsAnalyzing,
  setAnalysisError,
  isAnalyzing,
  analysisError,
}: TextInputPageProps) => {
  const [text, setText] = useState<string>("");

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert("계약 내용을 입력해주세요.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisError("");

      const uuid = getOrCreateGuestUuid();
      const result = await analyzeText(text, uuid, "텍스트 분석 요청");
      onAnalysisSuccess(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "분석 중 오류가 발생했습니다.";
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setText("");
    setAnalysisError("");
  };

  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-hero__text">
          <p className="home-badge">계약서 독소 조항 탐지</p>
          <h2 className="home-title">
            계약서를 붙여넣고
            <br />
            위험 조항을 빠르게 확인하세요
          </h2>
          <p className="home-desc">
            주요 위험 조항을 요약하고, 수정 방향을 함께 제안합니다.
          </p>
        </div>

        <div className="home-hero__card">
          <div className="card">
            <div className="card__header">
              <h3>계약서 텍스트 입력</h3>
              <p className="card__sub">아래에 계약서 내용을 그대로 붙여넣어 주세요.</p>
            </div>

            <div className="card__body">
              <label className="field">
                <span className="field__label">계약 내용</span>
                <textarea
                  id="contract-text"
                  className="field__textarea"
                  placeholder="계약서의 내용을 복사하여 입력해주세요. 예: 갑은 을에게 변상금을 지급하지 않는다..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={14}
                />
              </label>

              {analysisError && <div className="alert alert--error">{analysisError}</div>}

              <div className="home-actions">
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

              <div className="home-note">
                <strong>Tip</strong>
                <span>
                  개인정보/민감정보는 가급적 가린 뒤 입력하는 걸 권장합니다.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="home-grid">
        <div className="card card--soft">
          <div className="card__header">
            <h3>무엇을 해주나요?</h3>
            <p className="card__sub">아래 항목을 중심으로 점검합니다.</p>
          </div>
          <div className="card__body">
            <ul className="feature-list">
              <li>
                <span className="feature-dot" />
                일방적 손해배상 / 과도한 위약금
              </li>
              <li>
                <span className="feature-dot" />
                책임 제한/면책의 불균형
              </li>
              <li>
                <span className="feature-dot" />
                자동 갱신/해지 제한 등 분쟁 가능 조항
              </li>
            </ul>
          </div>
        </div>

        <div className="card card--soft">
          <div className="card__header">
            <h3>데이터는 어떻게 관리되나요?</h3>
            <p className="card__sub">입력한 내용은 분석에만 쓰이고, 안전하게 구분해서 관리해요.</p>
          </div>
          <div className="card__body">
            <p className="muted">
              로그인 없이도 사용할 수 있도록, 브라우저마다 임시 식별번호를 만들어 저장해요. 이 번호로 내 분석 기록만 구분해요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextInputPage;
