import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import NavbarDashboard from "@/components/NavbarDashboard";

export const metadata = {
  title: "Dashboard | PublikMartket",
};

export default async function Dashboard() {
  const setCookies = await cookies();
  const session = setCookies.get("myapp_session")?.value;
  if (!session) redirect("/");
  const boutiqueId = String(session);

  const reponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/recupPaiement/${boutiqueId}`,
    {
      cache: "no-store",
    }
  );
  const result = await reponse.json();

  const paiement = result.paiement;

  const totalProduits = result.totalProduits;

  if (!paiement) {
    return (
      <main className="relative w-full min-[1100px]:ml-64 p-6">
        <div className="flex justify-end mb-8">{<NavbarDashboard />}</div>
        <div className="flex flex-col justify-between items-center ">
          <Image
            src="/icone_alertAbonnement.png"
            alt="icone alert fin abonnement"
            width={500}
            height={500}
          />
          <p className="text-gray-400 text-center text-3xl font-extrabold">
            Vous n'avez pas d'abonnement actif. Veuillez souscrire a un
            abonnement pour pouvoir ajouter des produits.
          </p>
        </div>
      </main>
    );
  }

  if (paiement) {
    return (
      <main className="flex-1 p-[30px] min-[1100px]:ml-64">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Acceuil</h2>
          <NavbarDashboard />
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-2  max-[570px]:grid-cols-1 gap-4 ">
            <div className="text-center bg-white p-[30px]">
              <h4 className="text-2xl mb-[10px] font-bold">
                Fin de l'abonnement
              </h4>
              <span className="text-4xl max:[360]-text-3xl text-red-400 font-bold">
                {new Date(paiement.expiresAt).toLocaleString()}
              </span>
            </div>

            <div className="text-center bg-white p-[30px]">
              <h4 className="text-2xl font-bold">Nombre de produits ajoutes</h4>
              <span className="text-5xl font-bold">{totalProduits}</span>
            </div>

            <div className="text-center bg-white p-[30px]">
              <h4 className="text-2xl font-bold">
                Nombre de produits restants a ajoutez
              </h4>
              <span className="text-5xl font-bold">{paiement.nbrProduits}</span>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
