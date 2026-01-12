import React, { useState } from 'react';
import '../styles/ResultPage.css';
import { 
  RiBarChartLine, 
  RiErrorWarningFill, 
  RiAlertFill, 
  RiCheckboxCircleFill, 
  RiSearchLine, 
  RiLightbulbLine, 
  RiDownloadLine, 
  RiRefreshLine,
  RiShieldCheckLine,
  RiArrowRightLine
} from 'react-icons/ri';

interface ResultPageProps {
  file: File | null;
  text: string;
  result: any;
  onReset: () => void;
}

// 디자인 확인용 더미 데이터
const MOCK_RESULTS = [
  {
    id: 1,
    type: 'danger',
    title: '포괄적 손해배상',
    clause: '제 5조 (손해배상) 을은 본 계약과 관련하여 갑에게 발생한 모든 손해(간접 손해 및 특별 손해 포함)를 배상하여야 한다.',
    reason: '귀책사유의 유무를 묻지 않고 모든 손해를 배상하도록 하는 것은 "을"에게 부당하게 불리한 조항입니다.',
    suggestion: '을의 고의 또는 중대한 과실로 인하여 갑에게 손해가 발생한 경우, 을은 그 손해를 배상하여야 한다. 단, 간접 손해 및 특별 손해는 제외한다.'
  },
  {
    id: 2,
    type: 'warning',
    title: '모호한 계약 해지 사유',
    clause: '제 12조 (계약의 해지) 갑은 을의 업무 수행이 미흡하다고 판단될 경우 즉시 본 계약을 해지할 수 있다.',
    reason: '"미흡하다"는 기준이 주관적이며, 최고(시정 요구) 절차 없이 즉시 해지하는 것은 과도합니다.',
    suggestion: '갑은 을의 업무 수행이 객관적으로 명시된 기준에 미달할 경우, 14일 이상의 기간을 정하여 시정을 요구하고, 기간 내에 시정되지 않을 시 계약을 해지할 수 있다.'
  },
  {
    id: 3,
    type: 'safe',
    title: '비밀유지 의무',
    clause: '제 8조 (비밀유지) 양 당사자는 본 계약 수행 중 지득한 상대방의 비밀정보를 제3자에게 누설해서는 안 된다.',
    reason: '양 당사자에게 동등하게 의무를 부과하고 있으므로 공정한 조항입니다.',
    suggestion: null
  }
];

const ResultPage: React.FC<ResultPageProps> = ({ file, text, result, onReset }) => {
  const [filter, setFilter] = useState<'all' | 'danger' | 'warning' | 'safe'>('all');
  
  // 실제로는 result prop을 사용해야 하지만, 디자인을 위해 더미 데이터 사용
  const displayResults = MOCK_RESULTS; 
  const source = file ? file.name : (text ? '텍스트 입력' : '알 수 없음');

  // 통계 계산
  const stats = {
    danger: displayResults.filter(r => r.type === 'danger').length,
    warning: displayResults.filter(r => r.type === 'warning').length,
    safe: displayResults.filter(r => r.type === 'safe').length,
  };
  
  const totalIssues = stats.danger + stats.warning;
  const safetyScore = Math.max(0, 100 - (stats.danger * 20) - (stats.warning * 10));

  const filteredList = filter === 'all' 
    ? displayResults 
    : displayResults.filter(item => item.type === filter);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#51cf66';
    if (score >= 50) return '#fcc419';
    return '#ff6b6b';
  };

  return (
    <div className="result-page">
      <div className="result-container">
        {/* 헤더 섹션 */}
        <div className="result-header">
          <div className="header-top">
            <h2><RiBarChartLine /> AI 계약서 분석 리포트</h2>
            <div className="source-badge">
              <span>분석 대상:</span>
              <strong>{source}</strong>
            </div>
          </div>
          
          <div className="score-card">
            <div className="score-circle" style={{ borderColor: getScoreColor(safetyScore) }}>
              <div className="score-value" style={{ color: getScoreColor(safetyScore) }}>
                {safetyScore}
              </div>
              <div className="score-label">안전 점수</div>
            </div>
            <div className="score-info">
              <h3>
                {safetyScore >= 80 ? '비교적 안전한 계약서입니다.' : 
                 safetyScore >= 50 ? '주의가 필요한 조항이 있습니다.' : 
                 '독소조항이 다수 포함되어 있습니다.'}
              </h3>
              <p>총 <strong>{totalIssues}건</strong>의 검토 필요 항목이 발견되었습니다.</p>
            </div>
          </div>
        </div>

        {/* 요약 통계 */}
        <div className="result-summary">
          <div className={`summary-card danger ${filter === 'danger' ? 'active' : ''}`} onClick={() => setFilter('danger')}>
            <div className="summary-icon"><RiErrorWarningFill /></div>
            <div className="summary-content">
              <div className="summary-label">위험 조항</div>
              <div className="summary-number">{stats.danger}건</div>
            </div>
          </div>
          <div className={`summary-card warning ${filter === 'warning' ? 'active' : ''}`} onClick={() => setFilter('warning')}>
            <div className="summary-icon"><RiAlertFill /></div>
            <div className="summary-content">
              <div className="summary-label">주의 조항</div>
              <div className="summary-number">{stats.warning}건</div>
            </div>
          </div>
          <div className={`summary-card safe ${filter === 'safe' ? 'active' : ''}`} onClick={() => setFilter('safe')}>
            <div className="summary-icon"><RiShieldCheckLine /></div>
            <div className="summary-content">
              <div className="summary-label">안전 조항</div>
              <div className="summary-number">{stats.safe}건</div>
            </div>
          </div>
        </div>

        {/* 필터 및 리스트 */}
        <div className="results-section">
          <div className="section-header">
            <h3>상세 분석 결과</h3>
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                전체 보기
              </button>
              <button 
                className={`filter-tab ${filter === 'danger' ? 'active' : ''}`}
                onClick={() => setFilter('danger')}
              >
                위험 ({stats.danger})
              </button>
              <button 
                className={`filter-tab ${filter === 'warning' ? 'active' : ''}`}
                onClick={() => setFilter('warning')}
              >
                주의 ({stats.warning})
              </button>
            </div>
          </div>

          <div className="results-list">
            {filteredList.length === 0 ? (
              <div className="empty-state">
                <RiSearchLine className="empty-icon" />
                <p>해당하는 조항이 없습니다.</p>
              </div>
            ) : (
              filteredList.map((item) => (
                <div key={item.id} className={`result-card ${item.type}`}>
                  <div className="card-header">
                    <span className={`status-badge ${item.type}`}>
                      {item.type === 'danger' && <RiErrorWarningFill />}
                      {item.type === 'warning' && <RiAlertFill />}
                      {item.type === 'safe' && <RiCheckboxCircleFill />}
                      {item.type === 'danger' ? '위험' : item.type === 'warning' ? '주의' : '안전'}
                    </span>
                    <h4 className="card-title">{item.title}</h4>
                  </div>
                  
                  <div className="card-body">
                    <div className="clause-box">
                      <p>"{item.clause}"</p>
                    </div>
                    
                    <div className="analysis-box">
                      <p className="analysis-reason">
                        <strong><RiSearchLine /> AI 분석:</strong> {item.reason}
                      </p>
                      
                      {item.suggestion && (
                        <div className="suggestion-box">
                          <strong><RiLightbulbLine /> 수정 제안:</strong>
                          <p>{item.suggestion}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="action-buttons">
          <button className="btn btn-secondary action-btn">
            <RiDownloadLine /> 결과 리포트 다운로드 (PDF)
          </button>
          <button className="btn btn-primary action-btn" onClick={onReset}>
            <RiRefreshLine /> 다른 계약서 다시 검사하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;