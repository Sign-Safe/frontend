import React from 'react';
import '../styles/Header.css';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: 'text-input' | 'file-upload' | 'result') => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>🛡️ Sign Safe</h1>
        </div>
        
        <nav className="navigation">
          <button
            className={`nav-button ${currentPage === 'text-input' ? 'active' : ''}`}
            onClick={() => onPageChange('text-input')}
          >
            📝 텍스트 입력
          </button>
          
          <button
            className={`nav-button ${currentPage === 'file-upload' ? 'active' : ''}`}
            onClick={() => onPageChange('file-upload')}
          >
            📁 파일 업로드
          </button>
          
          {currentPage === 'result' && (
            <button
              className={`nav-button ${currentPage === 'result' ? 'active' : ''}`}
              onClick={() => onPageChange('result')}
              disabled
            >
              📊 분석 결과
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
