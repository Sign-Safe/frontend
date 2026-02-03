"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import TextInputPage from "./components/TextInputPage";
import FileUploadPage from "./components/FileUploadPage";
import ResultPage from "./components/ResultPage";
import { analyzeFile, getOrCreateGuestUuid } from "./lib/api";

type PageType = "text-input" | "file-upload" | "result";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("text-input");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [analysisCreatedAt, setAnalysisCreatedAt] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string>("");

  const currentPageRef = useRef<PageType>(currentPage);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 첫 진입 시 현재 단계(state)가 없으면 현재 단계를 replace로 기록
    if (!window.history.state || !window.history.state.page) {
      window.history.replaceState({ page: currentPageRef.current }, "");
    }

    const onPopState = (event: PopStateEvent) => {
      const nextPage = (event.state?.page as PageType | undefined) || "text-input";
      setCurrentPage(nextPage);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const pushPage = (page: PageType) => {
    if (typeof window !== "undefined") {
      window.history.pushState({ page }, "");
    }
    setCurrentPage(page);
  };

  const handlePageChange = (page: PageType) => {
    pushPage(page);
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setInputText("");
    setAnalysis("");
    setSummary("");
    setAnalysisError("");
    setIsAnalyzing(true);
    try {
      const uuid = getOrCreateGuestUuid();
      const result = await analyzeFile(file, uuid);
      setAnalysis(result.analysis);
      setSummary(result.summary || "");
      setAnalysisCreatedAt(result.createdAt || "");
      pushPage("result");
    } catch (error) {
      const message = error instanceof Error ? error.message : "파일 분석에 실패했습니다.";
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
              onAnalysisSuccess={(result) => {
                setAnalysis(result.analysis);
                setSummary(result.summary || "");
                setAnalysisCreatedAt(result.createdAt || "");
                setInputText(result.userPrompt);
                pushPage("result");
              }}
              setIsAnalyzing={setIsAnalyzing}
              setAnalysisError={setAnalysisError}
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
              summary={summary}
              createdAt={analysisCreatedAt}
            />
          )}
        </main>
      </div>
    </div>
  );
}
