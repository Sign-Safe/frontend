import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import TextInputPage from './pages/TextInputPage';
import FileUploadPage from './pages/FileUploadPage';
import ResultPage from './pages/ResultPage';

type PageType = 'text-input' | 'file-upload' | 'result';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('text-input');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setCurrentPage('result');
  };

  const handleTextAnalysis = (text: string) => {
    setInputText(text);
    // 분석 결과 설정 (임시)
    setAnalysisResult({
      text: text,
      results: []
    });
    setCurrentPage('result');
  };

  const handleReset = () => {
    setUploadedFile(null);
    setInputText('');
    setAnalysisResult(null);
    setCurrentPage('text-input');
  };

  return (
    <div className="App">
      <div className="app-container">
        <Header currentPage={currentPage} onPageChange={handlePageChange} />
        
        <main className="main-content">
        {currentPage === 'text-input' && (
          <TextInputPage onAnalysis={handleTextAnalysis} />
        )}
        {currentPage === 'file-upload' && (
          <FileUploadPage onFileUpload={handleFileUpload} />
        )}
        {currentPage === 'result' && (
          <ResultPage 
            file={uploadedFile} 
            text={inputText} 
            result={analysisResult}
            onReset={handleReset}
          />
        )}
      </main>
      </div>
    </div>
  );
}

export default App;
