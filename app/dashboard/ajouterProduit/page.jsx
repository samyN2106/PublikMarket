"use client";
import NavbarDashboard from "@/components/NavbarDashboard";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useTraiterImageProduit } from "@/hooks/useTraiterImageProduit";
import { ActionAddProduit } from "@/app/actions/ActionAddProduit";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function AjouterProduit() {
  const { setFile, imageUrl, erreurFile } = useTraiterImageProduit();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [ficher, setFicher] = useState(null);
  const [errorServeur, setErrorServeur] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setFile(ficher);
  }, [ficher]);

  const onSubmit = async (data) => {
    try {
      if (imageUrl) {
        data.image = imageUrl;
        const reponse = await ActionAddProduit(data);
        if (!reponse.success) setErrorServeur(reponse.error);
        if (reponse.success) router.push("/dashboard/produits");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit :", error);
    }
  };

  if (erreurFile) {
    console.error("erreurFile:", erreurFile);
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

  if (errorServeur)
    return (
      <main className="flex flex-col p-[30px] w-full justify-center  items-center min-[1100px]:ml-64">
        <Image
          src="/message-derreur.png"
          width={100}
          height={100}
          alt="icone erreur"
        />
        <p>{errorServeur}</p>
      </main>
    );

  return (
    <main className="flex flex-col w-full min-[540]:p-[30px] max-[540]:py-[30px] max-[540]:p-2.5 min-[1100px]:ml-64">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Ajouter Produit</h2>
        <NavbarDashboard />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-xl relative  w-full"
      >


        {/* champs nom produit */}
        <div className=" mb-4">
          <input
            {...register("nomProduit", {
              required: "Donnez un nom au produit",
            })}
            type="text"
            placeholder="Nom du produit"
            className="w-full border p-2 rounded-lg  outline-0"
          />
          {errors.nomProduit && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nomProduit.message}
            </p>
          )}
        </div>

        {/* champs description produit */}
        <div className=" mb-4">
          <textarea
            {...register("description", {
              required: "Description requise",
            })}
            placeholder="Description du produit"
            className="w-full border p-2 rounded-lg  outline-0"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* champs prix produit */}
        <div className=" mb-4">
          <input
            {...register("prixProduit", {
              required: "Prix requis",
            })}
            type="number"
            placeholder="Prix du produit ex:40.000"
            className="w-full border p-2 rounded-lg  outline-0"
            min="1"
          />
          {errors.prixProduit && (
            <p className="text-red-500 text-sm mt-1">
              {errors.prixProduit.message}
            </p>
          )}
        </div>

        {/* champs numero a contacter */}
        <div className=" mb-4">
          <input
            {...register("numeroAcontacter", {
              required: "Entrez un numero a contacter",
            })}
            type="text"
            placeholder="Numero a contacter pour le produit"
            className="w-full border p-2 rounded-lg outline-0"
          />
          {errors.numeroAcontacter && (
            <p className="text-red-500 text-sm mt-1">
              {errors.numeroAcontacter.message}
            </p>
          )}
        </div>

        {/* champs point de livraison */}
        <div className=" mb-4">
          <input
            {...register("pointDeLivraison", {
              required: "Champ requis",
            })}
            type="text"
            placeholder="point de livraison. Ex: Abidjan,Bouake......"
            className="w-full border p-2 rounded-lg outline-0"
          />
          {errors.pointDeLivraison && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pointDeLivraison.message}
            </p>
          )}
        </div>

        {/* champs image produit */}
        <div className=" mb-6">
          <input
            onChange={(e) => {
              setFicher(e.target.files?.[0]);
            }}
            accept="image/*"
            type="file"
            className="w-full border p-2 rounded-lg  outline-0"
          />
          {!ficher && (
            <p className="text-red-500 text-sm mt-1">
              Choisissez une image pour le produit
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 font-semibold rounded-lg text-white
    ${
      isSubmitting
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#9e86ba] hover:bg-[#9d92a8]"
    }`}
        >
          {isSubmitting ? "Chargement..." : "Ajouter le produit"}
        </button>
      </form>
    </main>
  );
}
