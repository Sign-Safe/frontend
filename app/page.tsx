"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import TextInputPage from "./components/TextInputPage";
import FileUploadPage from "./components/FileUploadPage";
import ResultPage from "./components/ResultPage";
import NonContractPage from "./components/NonContractPage";
import { analyzeFile, getOrCreateGuestUuid } from "./lib/api";

type PageType = "text-input" | "file-upload" | "result" | "non-contract";

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
  const [nonContractMessage, setNonContractMessage] = useState<string>("");

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
    setNonContractMessage("");
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
          hasNonContract?: boolean;
          nonContractMessage?: string;
        };

        if (saved.hasResult) {
          setAnalysis(saved.analysis || "");
          setSummary(saved.summary || "");
          setCoreResult(saved.coreResult || "");
          setAnalysisCreatedAt(saved.createdAt || "");
          setInputText(saved.inputText || "");
          setUploadedFileName(saved.fileName || "");
          setUploadedFile(null);
        } else if (saved.hasNonContract) {
          setInputText(saved.inputText || "");
          setUploadedFileName(saved.fileName || "");
          setNonContractMessage(saved.nonContractMessage || "");
          setUploadedFile(null);
        }

        if (saved.hasResult && savedPage === "result") {
          initialPage = "result";
        } else if (saved.hasNonContract && savedPage === "non-contract") {
          initialPage = "non-contract";
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

      // 뒤로가기로 결과 페이지 -> 입력 페이지로 이동하는 경우, 결과/non-contract state를 남기지 않음
      if (nextPage !== "result" && nextPage !== "non-contract") {
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
    const hasNonContract = Boolean(currentPage === "non-contract");
    const payload = {
      analysis,
      summary,
      coreResult,
      createdAt: analysisCreatedAt,
      inputText,
      fileName: uploadedFileName,
      hasResult,
      hasNonContract,
      nonContractMessage,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.localStorage.setItem(PAGE_KEY, currentPage);
  }, [analysis, summary, coreResult, analysisCreatedAt, inputText, uploadedFileName, currentPage, nonContractMessage]);

  const pushPage = (page: PageType) => {
    if (typeof window !== "undefined") {
      window.history.pushState({ page }, "");
    }

    // 사용자가 입력 화면으로 이동하면 이전 결과를 항상 폐기
    if (page !== "result" && page !== "non-contract") {
      resetResults();
    }

    setCurrentPage(page);

    // 결과/안내 화면은 진입 시 항상 맨 위에서 보이도록 스크롤을 초기화
    if (typeof window !== "undefined" && (page === "result" || page === "non-contract")) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    }
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
    setNonContractMessage("");
    setIsAnalyzing(true);
    try {
      const uuid = getOrCreateGuestUuid();
      const result = await analyzeFile(file, uuid);

      // 계약서가 아니면 별도 화면으로 분기
      if (result.isContract === false) {
        setNonContractMessage(
          result.analysis && result.analysis.startsWith("계약서가 아닙니다")
            ? result.analysis
            : "계약서가 아닙니다. 계약서 본문(조항/당사자/권리·의무 등이 포함된 텍스트)을 입력하거나 계약서 파일을 업로드해주세요."
        );
        pushPage("non-contract");
        return;
      }

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
                // 계약서가 아니면 별도 화면으로 분기
                if (result.isContract === false) {
                  setNonContractMessage(
                    result.analysis && result.analysis.startsWith("계약서가 아닙니다")
                      ? result.analysis
                      : "계약서가 아닙니다. 계약서 본문(조항/당사자/권리·의무 등이 포함된 텍스트)을 복사하여 입력해주세요."
                  );
                  setInputText(result.userPrompt);
                  setUploadedFile(null);
                  setUploadedFileName("");
                  pushPage("non-contract");
                  return;
                }

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
            <FileUploadPage onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} analysisError={analysisError} />
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
          {currentPage === "non-contract" && <NonContractPage message={nonContractMessage} />}
        </main>
      </div>
    </div>
  );
}
