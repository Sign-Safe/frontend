"use client";

interface ResultPageProps {
  file: File | null;
  text: string;
  analysis: string;
  title: string;
  createdAt: string;
}

const ResultPage = ({ file, text, analysis, title, createdAt }: ResultPageProps) => {
  const source = file ? file.name : "텍스트 입력";
  const displayTitle = title || source;
  const displayDate = createdAt ? new Date(createdAt).toLocaleString() : "";

  return (
    <div className="result-page">
      <div className="result-container">
        <div className="result-header">
          <h2>📊 분석 결과</h2>
          <p className="source-info">출처: {source}</p>
        </div>

        <div className="result-summary">
          <div className="summary-card">
            <div className="summary-number">0</div>
            <div className="summary-label">위험 조항</div>
          </div>
          <div className="summary-card">
            <div className="summary-number">0</div>
            <div className="summary-label">주의 조항</div>
          </div>
          <div className="summary-card">
            <div className="summary-number">0</div>
            <div className="summary-label">안전 조항</div>
          </div>
        </div>

        <div className="results-section">
          <div className="filter-buttons">
            <button className="filter-btn active">전체</button>
            <button className="filter-btn danger">🔴 위험</button>
            <button className="filter-btn warning">🟡 주의</button>
            <button className="filter-btn safe">🟢 안전</button>
          </div>

          <div className="results-list">
            {analysis ? (
              <div className="result-item safe">
                <div className="result-header-item">
                  <span className="result-type">🟢 분석 결과</span>
                  <span className="result-title">{displayTitle}</span>
                </div>
                <p className="result-clause" style={{ whiteSpace: "pre-wrap" }}>
                  {analysis}
                </p>
                {displayDate && (
                  <p className="result-explanation">
                    <strong>분석 시각:</strong> {displayDate}
                  </p>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>분석 완료</h3>
                <p>아직 탐지된 독소조항이 없습니다.</p>
                <p style={{ fontSize: "0.9em", color: "#777C6D" }}>
                  분석이 진행 중이거나, 계약서에 위험 조항이 없을 수 있습니다.
                </p>
              </div>
            )}
          </div>

          <div className="sample-result" style={{ display: "none" }}>
            <div className="result-item danger">
              <div className="result-header-item">
                <span className="result-type">🔴 위험</span>
                <span className="result-title">무제한 손해배상</span>
              </div>
              <p className="result-clause">
                "을은 갑에게 무제한 손해배상을 하여야 한다."
              </p>
              <p className="result-explanation">
                <strong>이유:</strong> 일반적으로 손해배상의 범위를 제한하는 것이
                공정합니다. 무제한 손해배상은 을의 부담을 과도하게 증가시킬 수
                있습니다.
              </p>
              <div className="result-suggestion">
                <strong>💡 제안:</strong> "을의 손해배상 책임은 을이 받은 수수료의
                12개월분을 초과하지 않는다" 등으로 명확한 한계를 설정할 것을
                권장합니다.
              </div>
            </div>
          </div>
        </div>

        <div className="original-content">
          <h3>원본 내용</h3>
          <div className="content-display">
            {text || (file && `파일: ${file.name}`) || "내용이 없습니다."}
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn btn-secondary">📥 결과 다운로드</button>
          <button className="btn btn-secondary">🔄 다시 분석</button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
