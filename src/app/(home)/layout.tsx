import Navbar from "./components/Header/Navbar";
import Footer from "./components/Footer/Footer";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="min-h-150 h-full">{children}</main>
      <Footer />
    </>
  );
}
