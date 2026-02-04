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
  "종합 위험도",
  "주요 문제점",
  "핵심 리스크",
  "권고",
]);

const parseCoreResultLine = (line: string): { kind: "heading" | "text"; text: string } => {
  const trimmed = line.trim();

  // 제목 후보를 최대한 넓게 잡습니다.
  // - ### **제목**
  // - ### 제목 / ## 제목
  // - 제목:
  // - 제목 (순수 텍스트)
  // - '... 제목' 처럼 문장 끝에 제목만 오는 경우
  const markdownStrongHeadingMatch = trimmed.match(/^#{2,3}\s*\*\*(.+?)\*\*\s*$/);
  const markdownPlainHeadingMatch = trimmed.match(/^#{2,3}\s*(.+?)\s*$/);
  const colonHeadingMatch = trimmed.match(/^(.+?)\s*:\s*$/);

  const titleCandidate = (
    markdownStrongHeadingMatch?.[1] ??
    markdownPlainHeadingMatch?.[1] ??
    colonHeadingMatch?.[1] ??
    ""
  ).trim();

  if (titleCandidate && CORE_RESULT_TITLES.has(titleCandidate)) {
    return { kind: "heading", text: titleCandidate };
  }

  // 마크다운/콜론이 없는 케이스: 라인이 정확히 제목이거나, 라인 끝이 제목으로 끝나면 제목으로 처리
  if (CORE_RESULT_TITLES.has(trimmed)) {
    return { kind: "heading", text: trimmed };
  }

  for (const title of CORE_RESULT_TITLES) {
    if (trimmed.endsWith(title)) {
      return { kind: "heading", text: title };
    }
  }

  return { kind: "text", text: line };
};

const parseAnalysisLine = (line: string): { kind: "itemHeading" | "text"; text: string } => {
  const trimmed = line.trim();

  // 예: "1. 업무 범위", "2) 지연 배상금", "3 ) 저작권의 귀속"
  const match = trimmed.match(/^\d+\s*[\.|\)]\s*(.+?)\s*$/);
  if (match) {
    return { kind: "itemHeading", text: `${trimmed}` };
  }

  return { kind: "text", text: line };
};

const ResultPage = ({ file, text, analysis, summary, coreResult, createdAt }: ResultPageProps) => {
  const displayDate = createdAt ? new Date(createdAt).toLocaleString() : "";

  const coreLines = (coreResult || "").split(/\r?\n/);
  const analysisLines = (analysis || "").split(/\r?\n/);

  const summaryText = summary || analysis || "분석 결과가 없습니다.";
  const summaryLines = summaryText.split(/\r?\n/);
  const summaryTitle = summaryLines[0]?.trim() || "";
  const summaryBody = summaryLines.slice(1).join("\n").trim();

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

                const textToRender = parsed.text.length === 0 ? "\u00A0" : parsed.text;

                return (
                  <div key={idx} className="core-result__line">
                    {textToRender}
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
            {summaryTitle && <div className="summary__title">{summaryTitle}</div>}
            {summaryBody ? <div className="summary__body">{summaryBody}</div> : null}
          </div>
        </section>

        <section className="result-card result-card--danger">
          <div className="result-card__header">
            <h3>위험 조항</h3>
          </div>
          <div className="result-card__body content-display" style={{ whiteSpace: "pre-wrap" }}>
            {analysis ? (
              analysisLines.map((line, idx) => {
                const parsed = parseAnalysisLine(line);
                if (parsed.kind === "itemHeading") {
                  return (
                    <div key={idx} className="analysis-item__heading">
                      {parsed.text}
                    </div>
                  );
                }

                const textToRender = parsed.text.length === 0 ? "\u00A0" : parsed.text;

                return (
                  <div key={idx} className="analysis-item__line">
                    {textToRender}
                  </div>
                );
              })
            ) : (
              "위험 조항이 없습니다."
            )}
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
