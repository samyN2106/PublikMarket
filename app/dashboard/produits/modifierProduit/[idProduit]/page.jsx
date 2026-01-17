"use client";
import { useEffect, useState } from "react";
import deleteProduit from "@/app/actions/ActionDeleteProduit";
import { useParams } from "next/navigation";
import Image from "next/image";
import NavbarDashboard from "@/components/NavbarDashboard";
import { useForm } from "react-hook-form";
import { useTraiterImageProduit } from "@/hooks/useTraiterImageProduit";
import ModifierProduit from "@/app/actions/ActionModifierProduit";
import { useRouter } from "next/navigation";

export default function MdofifProduit() {
  const { idProduit } = useParams();
  const router = useRouter();
  const [produit, setProduit] = useState(null);
  const [confirmerSupprimerProduit, setConfirmerSupprimerProduit] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [ficher, setFicher] = useState(null);
  const { register, handleSubmit } = useForm();
  const [erreurForm, setErreurForm] = useState("");
  const { setFile, imageUrl, erreurFile } = useTraiterImageProduit();

  useEffect(() => {
    async function fetchProduit() {
      const reponse = await fetch(`/api/produit?$idProduit={idProduit}`);
      const result = await reponse.json();
      if (reponse.ok) {
        setProduit(result.produit);
      }
    }
    if (idProduit) fetchProduit();
  }, [idProduit]);

  function SupprimerProduit() {
    deleteProduit({ idProduit });
    router.push("/dashboard/produits");
  }

  const onSubmit = async (data) => {
    data.id = idProduit;
    if (ficher) setFile(ficher);
    if (!ficher) {
      data.image = produit.image;
      const reponse = await ModifierProduit(data);

      if (!reponse.success) {
        setLoading(false);
        setErreurForm(reponse.error);
      } else {
        setLoading(false);
        router.push("/dashboard/produits");
      }
    }
    if (ficher && imageUrl) {
      data.image = imageUrl;
      const reponse = await ModifierProduit(data);
      const result = reponse.json();

      if (!reponse.success) {
        setLoading(false);
        setErreurForm(result.error);
      } else {
        setLoading(false);
        router.push("/dashboard/produits");
      }
    } else {
      setLoading(false);
      if (erreurFile) console.error(erreurFile.message);
      return (
        <main className="flex flex-col p-[30px] w-full justify-center  items-center min-[1100px]:ml-64 ">
          <Image
            src="/message-derreur.png"
            width={100}
            height={100}
            alt="icone erreur"
          />
          <p> Erreur lors du chargement de l'image.........</p>
        </main>
      );
    }
  };

  if (produit) {
    // affichage d'erreur
    if (erreurForm)
      return (
        <main className="flex flex-col min-[1100px]:ml-64 p-[30px] w-full justify-center  items-center ">
          <Image
            src="/message-derreur.png"
            width={300}
            height={300}
            alt="icone erreur"
          />
          <p>{erreurForm}</p>
        </main>
      );

    return (
      <main className="min-[400px]:p-[30px] w-full max-[400px]:p-[20px] relative min-[1100px]:ml-64">
        {/* bloc confirmer suprression du produit */}
        {confirmerSupprimerProduit ? (
          <div className="fixed w-full inset-0 bg-[#0000006b] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
              <h2 className="text-lg font-semibold mb-4">
                Confirmer la déconnexion
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer ce produit ?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setConfirmerSupprimerProduit(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={SupprimerProduit}
                  className="px-4 py-2 bg-[#9e86ba] text-white rounded hover:bg-[#b7b2bd]"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Modifier produit</h2>
          <NavbarDashboard />
        </div>

        <div className="flex w-full gap-[30px] max-[810px]:flex-col-reverse max-[810px]:items-center">
          <div className="min-[810px]:w-[700px] min-[810px]:h-[600px] max-[810px]:w-[400px] max-[810px]:h-[500px] max-[450px]:w-[350px] max-[450px]:h-[500px] relative">
            <Image src={produit.image} fill alt={produit.nomProduit} />
          </div>

          {/* formulaire des donnees du produit */}
          <div className="w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white p-6 rounded-xl relative shadow-md mb-10 mx-auto "
            >
              {/* afficher le  chargement */}
              {loading ? (
                <div className="absolute top-[50%] left-[50%] translate-[-50%]">
                  <Image
                    src="/iconeLoading.gif"
                    width={60}
                    height={60}
                    alt="Loading"
                  />
                </div>
              ) : (
                ""
              )}

              <div className="mb-4">
                <input
                  {...register("nomProduit")}
                  type="text"
                  defaultValue={produit.nomProduit}
                  placeholder="Nom du produit"
                  className="w-full border p-2 rounded-lg  outline-0"
                />
              </div>
              <div className=" mb-4">
                <textarea
                  {...register("description")}
                  defaultValue={produit.description}
                  placeholder="Description du produit"
                  className="w-full border p-2 rounded-lg  outline-0"
                />
              </div>
              <div className=" mb-4">
                <input
                  {...register("prixProduit")}
                  type="number"
                  defaultValue={produit.prixProduit}
                  placeholder="Prix du produit ex:40.000 FCFA "
                  className="w-full border p-2 rounded-lg  outline-0"
                  min="1"
                />
              </div>
              <div className=" mb-4">
                <input
                  {...register("numeroAcontacter")}
                  type="text"
                  defaultValue={produit.numeroAcontacter}
                  placeholder="Numero a contacter pour le produit"
                  className="w-full border p-2 rounded-lg outline-0"
                />
              </div>
              <div className=" mb-4">
                <input
                  {...register("pointDeLivraison")}
                  type="text"
                  defaultValue={produit.pointDeLivraison}
                  placeholder="point de livraison. Ex: Abidjan,Bouake......"
                  className="w-full border p-2 rounded-lg outline-0"
                />
              </div>
              <div className=" mb-6">
                <input
                  accept="image/*"
                  onChange={(e) => setFicher(e.target.files?.[0])}
                  type="file"
                  className="w-full border p-2 rounded-lg  outline-0"
                />
              </div>

              <button
                type="button"
                onClick={() => setConfirmerSupprimerProduit(true)}
                className="bg-[#9e86ba] max-[1300px]:mb-[20px] text-white px-4 py-2 font-semibold rounded-lg hover:bg-[#9d92a8] mr-[20px]"
              >
                Supprimer le Produit
              </button>

              <button
                onClick={() => {
                  setLoading(true);
                }}
                type="submit"
                className={`bg-[#9e86ba] text-white px-4 py-2 font-semibold rounded-lg hover:bg-[#9d92a8] }`}
              >
                Modifier Produit
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <main className="w-full flex flex-col justify-center items-center  relative min-[1100px]:ml-64">
        <Image src="/iconeLoading.gif" width={60} height={60} alt="Loading" />
        <p className="mt-[30px]">Chargement des donnees....................</p>
      </main>
    );
  }
}
