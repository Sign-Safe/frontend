"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import TextInputPage from "./components/TextInputPage";
import FileUploadPage from "./components/FileUploadPage";
import ResultPage from "./components/ResultPage";
import { analyzeFile, getOrCreateGuestUuid } from "./lib/api";

type PageType = "text-input" | "file-upload" | "result";

const STORAGE_KEY = "signsafe:analysis";
const PAGE_KEY = "signsafe:page";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("text-input");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [coreResult, setCoreResult] = useState<string>("");
  const [suggestion, setSuggestion] = useState<string>("");
  const [analysisCreatedAt, setAnalysisCreatedAt] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string>("");

  const currentPageRef = useRef<PageType>(currentPage);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  const resetResults = () => {
    setAnalysis("");
    setSummary("");
    setCoreResult("");
    setSuggestion("");
    setAnalysisCreatedAt("");
    setUploadedFile(null);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedRaw = window.localStorage.getItem(STORAGE_KEY);
    const savedPage = window.localStorage.getItem(PAGE_KEY) as PageType | null;

    let initialPage: PageType = "text-input";

    if (savedRaw) {
      try {
        const saved = JSON.parse(savedRaw) as {
          analysis?: string;
          summary?: string;
          coreResult?: string;
          createdAt?: string;
          inputText?: string;
          fileName?: string;
          hasResult?: boolean;
        };

        if (saved.hasResult) {
          setAnalysis(saved.analysis || "");
          setSummary(saved.summary || "");
          setCoreResult(saved.coreResult || "");
          setAnalysisCreatedAt(saved.createdAt || "");
          setInputText(saved.inputText || "");
          setUploadedFileName(saved.fileName || "");
          setUploadedFile(null);
        }

        if (saved.hasResult && savedPage === "result") {
          initialPage = "result";
        } else if (savedPage === "text-input" || savedPage === "file-upload") {
          initialPage = savedPage;
        }
      } catch {
        // ignore invalid storage data
      }
    }

    setCurrentPage(initialPage);
    window.history.replaceState({ page: initialPage }, "");

    const onPopState = (event: PopStateEvent) => {
      const nextPage = (event.state?.page as PageType | undefined) || "text-input";

      // 뒤로가기로 결과 페이지 -> 입력 페이지로 이동하는 경우, 결과 state를 남기지 않음
      if (nextPage !== "result") {
        resetResults();
      }

      setCurrentPage(nextPage);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasResult = Boolean(analysis || summary || coreResult);
    const payload = {
      analysis,
      summary,
      coreResult,
      createdAt: analysisCreatedAt,
      inputText,
      fileName: uploadedFileName,
      hasResult,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.localStorage.setItem(PAGE_KEY, currentPage);
  }, [analysis, summary, coreResult, analysisCreatedAt, inputText, uploadedFileName, currentPage]);

  const pushPage = (page: PageType) => {
    if (typeof window !== "undefined") {
      window.history.pushState({ page }, "");
    }

    // 사용자가 입력 화면으로 이동하면 이전 결과를 항상 폐기
    if (page !== "result") {
      resetResults();
    }

    setCurrentPage(page);
  };

  const handlePageChange = (page: PageType) => {
    pushPage(page);
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setUploadedFileName(file.name);
    setInputText("");
    setAnalysis("");
    setSummary("");
    setCoreResult("");
    setSuggestion("");
    setIsAnalyzing(true);
    try {
      const uuid = getOrCreateGuestUuid();
      const result = await analyzeFile(file, uuid);
      setAnalysis(result.analysis);
      setSummary(result.summary || "");
      setCoreResult(result.coreResult || "");
      setSuggestion(result.suggestion || "");
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
              onAnalysisStart={() => {
                resetResults();
              }}
              onAnalysisSuccess={(result) => {
                setAnalysis(result.analysis);
                setSummary(result.summary || "");
                setCoreResult(result.coreResult || "");
                setSuggestion(result.suggestion || "");
                setAnalysisCreatedAt(result.createdAt || "");
                setInputText(result.userPrompt);
                setUploadedFile(null);
                setUploadedFileName("");
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
              fileName={uploadedFileName}
              text={inputText}
              analysis={analysis}
              summary={summary}
              coreResult={coreResult}
              suggestion={suggestion}
              createdAt={analysisCreatedAt}
            />
          )}
        </main>
      </div>
    </div>
  );
}
