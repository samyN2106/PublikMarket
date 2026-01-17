import Button from "@/components/Button";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { idProduit } = await params;

  const reponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/produit?idProduit=${idProduit}`,
    {
      cache: "no-store",
    }
  );

  const result = await reponse.json();

  if (reponse.ok) {
    const Currentproduit = result.produit;
    return {
      title: `${Currentproduit.nomProduit} | PublikMarket`,
      description: `Achetez ${Currentproduit.nomProduit} au meilleur prix sur PublikMarket.`,
    };
  }
}

export default async function produitId({ params }) {
  const { idProduit } = await params;

  const reponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/produit?idProduit=${idProduit}`,
    {
      cache: "no-store",
    }
  );

  const result = await reponse.json();

  if (reponse.ok) {
    const Currentproduit = result.produit;

    if (!Currentproduit) return notFound();

    return (
      <>
        <header>
          <nav className="flex justify-end p-[20px]">
            <div>
              <Button href={`/MarketEspace/${Currentproduit.boutiqueId}`}>
                Voir tous les produits de ce vendeur
              </Button>
            </div>
          </nav>
        </header>

        <main className="max-w-[1200px] min-[760px]:mx-auto mt-[30px] ">
          <section className="mb-[100px]">
            <h2 className="text-center text-[30px] font-bold mb-[30px]">
              {Currentproduit.nomProduit}
            </h2>
            {
              <div className="flex max-[760px]:flex-col items-center max-[1300px]:mx-[50px] max-[900px]:mx-[20px]">
                <div className="w-[50%] max-[760px]:w-full mb-[20px] min-[760px]:h-[450px] max-[760px]:h-[350px] min-[760px]:mr-[30px] relative">
                  <span className="absolute bg-white right-0 top-0 px-[15px] z-10 font-bold text-xl text-red-600">
                    {Currentproduit.price} FCFA
                  </span>
                  <Image
                    fill
                    src={Currentproduit.image}
                    alt={Currentproduit.nomProduit}
                  />
                </div>
                <div className="w-[50%] max-[760px]:w-full text-2xl flex flex-col max-[760px]:flex-col-reverse justify-center gap-[50px]">
                  <div>
                    <a
                      href={`tel:${Currentproduit.numAContacter}`}
                      className=" text-red-500"
                    >
                      <strong
                        className="text-black"
                        style={{ textDecoration: "underline" }}
                      >
                        Numero(s) a contacter
                      </strong>
                      : {Currentproduit.numAContacter}
                    </a>
                    <p className="mt-[20px]">
                      <strong style={{ textDecoration: "underline" }}>
                        Point(s) de livraison
                      </strong>
                      : {Currentproduit.pointLivraison}
                    </p>
                  </div>
                  <p className=" font-black ">
                    Contactez le vendeur pour echanger par rapport a ce produit
                  </p>

                  <div>
                    <strong style={{ textDecoration: "underline" }}>
                      Description
                    </strong>

                    <p className="text-xl">{Currentproduit.description}</p>
                  </div>
                </div>
              </div>
            }
          </section>
        </main>
      </>
    );
  }
}
