import "./globals.css";

export const metadata = {
  title: "Coming Soon",
  description: "Powered by Next.js and Bun",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
