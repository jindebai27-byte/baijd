import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "白金德 — UI / AI / Visual Designer",
  description: "白金德的个人作品集：6 年 UI 设计经验，专注产品体验、视觉系统与 AI 设计实践。",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
