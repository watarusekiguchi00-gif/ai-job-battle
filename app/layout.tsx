import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'AI JOB BATTLE | AIのミスを見破れ！', description: '60〜90秒で遊べるAI仕事チェックゲーム。AIの弱点を見抜いて高得点を狙おう。' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0b1020' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="ja"><body>{children}</body></html>; }
