import Navbar from "./components/Header/Navbar";
import Footer from "./components/Footer/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-150 h-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
