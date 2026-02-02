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
          {displayTitle && <p className="source-info">제목: {displayTitle}</p>}
          {displayDate && <p className="source-info">분석 시각: {displayDate}</p>}
        </div>

        <section className="results-section">
          <h3>분석 결과</h3>
          <div className="content-display" style={{ whiteSpace: "pre-wrap" }}>
            {analysis || "분석 결과가 없습니다."}
          </div>
        </section>

        <section className="results-section">
          <h3>위험 조항</h3>
          <div className="content-display" style={{ whiteSpace: "pre-wrap" }}>
            {analysis || "위험 조항이 없습니다."}
          </div>
        </section>

        <section className="results-section">
          <h3>원본 / 수정 제안</h3>
          <div className="text-two-column">
            <div className="text-column">
              <h4>원본</h4>
              <div className="content-display" style={{ whiteSpace: "pre-wrap" }}>
                {text || (file && `파일: ${file.name}`) || "내용이 없습니다."}
              </div>
            </div>
            <div className="text-column">
              <h4>수정 제안</h4>
              <div className="content-display" style={{ whiteSpace: "pre-wrap" }}>
                {analysis || "수정 제안이 없습니다."}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResultPage;
