import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sign Safe",
  description: "계약서 위험 조항 분석 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
