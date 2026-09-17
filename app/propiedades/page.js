import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingClient from "@/components/ListingClient";
import { properties } from "@/lib/properties";

export const metadata = {
  title: "Propiedades disponibles — Ricardo Riffo Propiedades",
};

export default function PropiedadesPage() {
  return (
    <>
      <Header />
      <main className="wrap">
        <div className="listheader">
          <h1>Propiedades disponibles</h1>
          <p>Actualizado por Ricardo esta semana. Filtra por comuna, tipo u operación.</p>
        </div>
        <ListingClient properties={properties} />
      </main>
      <Footer />
    </>
  );
}
