"use client";

interface ResultPageProps {
  file: File | null;
  text: string;
  analysis: string;
  summary?: string;
  coreResult?: string;
  createdAt: string;
}

const CORE_RESULT_TITLES = new Set([
  "전반적인 위험도 평가",
  "핵심 리스크 사항",
  "법적 무효 가능성",
  "전문가 의견",
]);

const parseCoreResultLine = (line: string): { kind: "heading" | "text"; text: string } => {
  const trimmed = line.trim();

  // 예: ### **전반적인 위험도 평가**
  const headingMatch = trimmed.match(/^###\s*\*\*(.+?)\*\*\s*$/);
  if (headingMatch) {
    const title = headingMatch[1].trim();
    if (CORE_RESULT_TITLES.has(title)) {
      return { kind: "heading", text: title };
    }
  }

  return { kind: "text", text: line };
};

const ResultPage = ({ file, text, analysis, summary, coreResult, createdAt }: ResultPageProps) => {
  const displayDate = createdAt && !Number.isNaN(Date.parse(createdAt))
    ? new Date(createdAt).toLocaleString()
    : new Date().toLocaleString();

  const coreLines = (coreResult || "").split(/\r?\n/);

  return (
    <div className="result-page">
      <div className="result-container result-container--clean">
        <div className="result-header result-header--clean">
          <div className="result-title-row">
            <h2>분석 결과</h2>
            {displayDate && <span className="result-date">{displayDate}</span>}
          </div>
          <p className="result-subtitle">계약서의 위험 조항을 요약하고, 수정 제안을 제공합니다.</p>
        </div>

        <section className="result-card">
          <div className="result-card__header">
            <h3>핵심 진단 결과</h3>
          </div>
          <div className="result-card__body content-display core-result" style={{ whiteSpace: "pre-wrap" }}>
            {coreResult ? (
              coreLines.map((line, idx) => {
                const parsed = parseCoreResultLine(line);
                if (parsed.kind === "heading") {
                  return (
                    <div key={idx} className="core-result__heading">
                      {parsed.text}
                    </div>
                  );
                }

                return (
                  <div key={idx} className="core-result__line">
                    {parsed.text}
                  </div>
                );
              })
            ) : (
              "핵심 진단 결과가 없습니다."
            )}
          </div>
        </section>

        <section className="result-card">
          <div className="result-card__header">
            <h3>요약</h3>
          </div>
          <div className="result-card__body content-display" style={{ whiteSpace: "pre-wrap" }}>
            {summary || analysis || "분석 결과가 없습니다."}
          </div>
        </section>

        <section className="result-card result-card--danger">
          <div className="result-card__header">
            <h3>위험 조항</h3>
          </div>
          <div className="result-card__body content-display" style={{ whiteSpace: "pre-wrap" }}>
            {analysis || "위험 조항이 없습니다."}
          </div>
        </section>

        <div className="text-two-column result-split">
          <div className="result-card result-card--inner">
            <div className="result-card__header">
              <h4>원본</h4>
            </div>
            <div className="result-card__body content-display" style={{ whiteSpace: "pre-wrap" }}>
              {text || (file && `파일: ${file.name}`) || "내용이 없습니다."}
            </div>
          </div>

          <div className="result-card result-card--inner result-card--suggestion">
            <div className="result-card__header">
              <h4>수정 제안</h4>
            </div>
            <div className="result-card__body content-display" style={{ whiteSpace: "pre-wrap" }}>
              {analysis || "수정 제안이 없습니다."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
