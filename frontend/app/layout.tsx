import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html><body className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-950 to-slate-900">{children}</body></html>;
}
