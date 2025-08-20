import AppFooter from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Sound Cloud",
  description: "website music",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
      <div style={{ marginTop: "100px" }}></div>
      <AppFooter />
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ abc: "abc" }) }} />
    </>
  );
}
