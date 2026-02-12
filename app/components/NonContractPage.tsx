"use client";

interface NonContractPageProps {
  message?: string;
}

const NonContractPage = ({ message }: NonContractPageProps) => {
  return (
    <div className="result-page">
      <div className="result-container result-container--clean">
        <div className="result-header result-header--clean">
          <div className="result-title-row">
            <h2>분석 결과</h2>
          </div>
          <p className="result-subtitle">계약서 텍스트/파일을 업로드하면 위험 조항을 분석해드립니다.</p>
        </div>

        <section className="result-card result-card--danger">
          <div className="result-card__header">
            <h3>안내</h3>
          </div>
          <div className="result-card__body content-display" style={{ whiteSpace: "pre-wrap" }}>
            {message || "계약서가 아닙니다."}
          </div>
        </section>
      </div>
    </div>
  );
};

export default NonContractPage;
