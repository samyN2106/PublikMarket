import "../globals.css";
import Footer from "@/components/Footer";

export default function MarketEspaceLayout({ children }) {
  return (
    <section>
      {children}
      <Footer />
    </section>
  );
}
