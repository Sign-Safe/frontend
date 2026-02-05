"use client";

import Image from "next/image";
import { MdTextFields } from "react-icons/md";
import { LuFilePlus2 } from "react-icons/lu";

import logoImage from "../../Image/SignSafe로고.png";

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: "text-input" | "file-upload" | "result") => void;
}

const Header = ({ currentPage, onPageChange }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-container">
        <button className="logo-button" onClick={() => onPageChange("text-input")}>
          <span className="logo">
            <Image
              src={logoImage}
              alt="Sign Safe 로고"
              className="logo-image"
              priority
            />
          </span>
        </button>

        <nav className="navigation">
          <button
            className={`nav-button ${currentPage === "text-input" ? "active" : ""}`}
            onClick={() => onPageChange("text-input")}
          >
            <span className="icon-adjust">
              <MdTextFields />
            </span>{" "}
            <span className="text-adjust">텍스트 입력</span>
          </button>

          <button
            className={`nav-button ${currentPage === "file-upload" ? "active" : ""}`}
            onClick={() => onPageChange("file-upload")}
          >
            <span className="icon-adjust">
              <LuFilePlus2 />
            </span>{" "}
            <span className="text-adjust">파일 업로드</span>
          </button>

          {currentPage === "result" && (
            <button
              className={`nav-button ${currentPage === "result" ? "active" : ""}`}
              onClick={() => onPageChange("result")}
              disabled
            >
              <span className="icon-adjust">
                <Image src="/file.svg" alt="분석 결과 아이콘" width={18} height={18} />
              </span>
              <span className="text-adjust">분석 결과</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
