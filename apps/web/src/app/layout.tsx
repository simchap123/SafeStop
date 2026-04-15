import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SafeStop",
  description: "Child vehicle safety system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
