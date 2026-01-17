"use client";

import { useState } from "react";
import Header from "./components/Header";
import TextInputPage from "./components/TextInputPage";
import FileUploadPage from "./components/FileUploadPage";
import ResultPage from "./components/ResultPage";

type PageType = "text-input" | "file-upload" | "result";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("text-input");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState<string>("");

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setCurrentPage("result");
  };

  const handleTextAnalysis = (text: string) => {
    setInputText(text);
    setCurrentPage("result");
  };

  return (
    <div className="App">
      <div className="app-container">
        <Header currentPage={currentPage} onPageChange={handlePageChange} />

        <main className="main-content">
          {currentPage === "text-input" && (
            <TextInputPage onAnalysis={handleTextAnalysis} />
          )}
          {currentPage === "file-upload" && (
            <FileUploadPage onFileUpload={handleFileUpload} />
          )}
          {currentPage === "result" && (
            <ResultPage file={uploadedFile} text={inputText} />
          )}
        </main>
      </div>
    </div>
  );
}
