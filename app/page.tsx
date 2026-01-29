"use client";

import { useState } from "react";
import Header from "./components/Header";
import TextInputPage from "./components/TextInputPage";
import FileUploadPage from "./components/FileUploadPage";
import ResultPage from "./components/ResultPage";
import { analyzeFile, analyzeText, getOrCreateGuestUuid } from "./lib/api";

type PageType = "text-input" | "file-upload" | "result";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("text-input");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [analysisTitle, setAnalysisTitle] = useState<string>("");
  const [analysisCreatedAt, setAnalysisCreatedAt] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string>("");

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setInputText("");
    setAnalysis("");
    setAnalysisError("");
    setIsAnalyzing(true);
    try {
      const uuid = getOrCreateGuestUuid();
      const result = await analyzeFile(file, uuid);
      setAnalysis(result.analysis);
      setAnalysisTitle(result.title || file.name);
      setAnalysisCreatedAt(result.createdAt || "");
      setCurrentPage("result");
    } catch (error) {
      const message = error instanceof Error ? error.message : "파일 분석에 실패했습니다.";
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextAnalysis = async (text: string) => {
    setInputText(text);
    setUploadedFile(null);
    setAnalysis("");
    setAnalysisError("");
    setIsAnalyzing(true);
    try {
      const uuid = getOrCreateGuestUuid();
      const result = await analyzeText(text, uuid, "텍스트 입력 분석");
      setAnalysis(result.analysis);
      setAnalysisTitle(result.title || "텍스트 입력 분석");
      setAnalysisCreatedAt(result.createdAt || "");
      setCurrentPage("result");
    } catch (error) {
      const message = error instanceof Error ? error.message : "텍스트 분석에 실패했습니다.";
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="App">
      <div className="app-container">
        <Header currentPage={currentPage} onPageChange={handlePageChange} />

        <main className="main-content">
          {currentPage === "text-input" && (
            <TextInputPage
              onAnalysis={handleTextAnalysis}
              isAnalyzing={isAnalyzing}
              analysisError={analysisError}
            />
          )}
          {currentPage === "file-upload" && (
            <FileUploadPage
              onFileUpload={handleFileUpload}
              isAnalyzing={isAnalyzing}
              analysisError={analysisError}
            />
          )}
          {currentPage === "result" && (
            <ResultPage
              file={uploadedFile}
              text={inputText}
              analysis={analysis}
              title={analysisTitle}
              createdAt={analysisCreatedAt}
            />
          )}
        </main>
      </div>
    </div>
  );
}
