import React, { useState } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import '../styles/FileUploadPage.css';

interface FileUploadPageProps {
  onFileUpload: (file: File) => void;
}

const FileUploadPage: React.FC<FileUploadPageProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const acceptedFormats = ['.pdf', '.docx', '.txt'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): boolean => {
    // 파일 형식 확인
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      setError('지원하지 않는 파일 형식입니다. (PDF, DOCX, TXT만 가능)');
      return false;
    }

    // 파일 크기 확인
    if (file.size > maxFileSize) {
      setError('파일 크기가 10MB를 초과합니다.');
      return false;
    }

    setError('');
    return true;
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    } else {
      setError('파일을 선택해주세요.');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError('');
  };

  return (
    <div className="file-upload-page">
      <div className="file-upload-container">
        <h2>계약서 파일 업로드</h2>

        <div
          className={`drag-drop-zone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <>
              <div className="upload-icon"><IoCloudUploadOutline /></div>
              <h3>파일을 드래그하여 놓으세요</h3>
              <p>또는</p>
              <label htmlFor="file-input" className="file-input-label">
                <span className="file-button">클릭하여 선택</span>
              </label>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleInputChange}
                className="file-input"
              />
              <p className="file-info">
                지원 형식: PDF, DOCX, TXT
                <br />
                최대 파일 크기: 10MB
              </p>
            </>
          ) : (
            <div className="selected-file">
              <div className="file-icon">📄</div>
              <div className="file-details">
                <h4>{selectedFile.name}</h4>
                <p>{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
              <button 
                className="remove-button"
                onClick={handleRemoveFile}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="button-group">
          <button 
            className="btn btn-secondary"
            onClick={handleRemoveFile}
            disabled={!selectedFile}
          >
            파일 제거
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            분석하기
          </button>
        </div>

        <div className="info-section">
          <h3>지원하는 파일 형식:</h3>
          <ul>
            <li><strong>PDF</strong> - 스캔된 문서도 가능</li>
            <li><strong>DOCX</strong> - Microsoft Word 문서</li>
            <li><strong>TXT</strong> - 순수 텍스트 파일</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUploadPage;
