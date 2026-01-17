"use client";

import { useState } from "react";

interface TextInputPageProps {
  onAnalysis: (text: string) => void;
}

const TextInputPage = ({ onAnalysis }: TextInputPageProps) => {
  const [text, setText] = useState<string>("");

  const handleAnalyze = () => {
    if (text.trim()) {
      onAnalysis(text);
    } else {
      alert("계약 내용을 입력해주세요.");
    }
  };

  const handleClear = () => {
    setText("");
  };

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
          <button className="btn btn-secondary" onClick={handleClear}>
            초기화
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={!text.trim()}
          >
            분석하기
          </button>
        </div>

        <div className="info-section">
          <h3>✨ 이 도구는:</h3>
          <ul>
            <li>계약서의 잠재적인 위험 조항을 자동으로 탐지합니다</li>
            <li>일방적 손해배상 조항, 무제한 책임 등을 식별합니다</li>
            <li>계약 검토 시간을 단축하는데 도움을 줍니다</li>
            <li>
              업로드된 모든 계약서는 암호화된 후 분석되며, 분석 완료 시 자동으로
              삭제됩니다.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TextInputPage;
