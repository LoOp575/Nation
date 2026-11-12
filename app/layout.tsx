import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { WorkspaceProvider } from "@/components/workspace-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "National Pulse | Indonesia Executive Monitor",
  description:
    "Platform pemantauan kondisi negara, APBN, utang, pajak, berita anti-cocoklogi, dampak proyek, dan sinyal akuntabilitas publik berbasis bukti.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" data-theme="light" suppressHydrationWarning>
      <body>
        <WorkspaceProvider>
          <AppShell>{children}</AppShell>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
