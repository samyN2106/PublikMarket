"use client";
import Link from "next/link";
import { useState } from "react";
import { useDashboardContext } from "@/Context/dashboardContext";
import { deleteCookie } from "@/app/actions/ActionDeconnexion";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { showSidebar, setShowSidebar } = useDashboardContext();
  const [showBlocDeconnexion, setShowBlocDeconnexion] = useState(false);
  const router = useRouter();

  const deconnexion = async () => {
    deleteCookie();
    router.push("/connexion");
  };

  return (
    <>
      {showBlocDeconnexion ? (
        <div className="fixed w-full inset-0 bg-[#0000006b] bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Confirmer la déconnexion
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowBlocDeconnexion(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={deconnexion}
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

      {showSidebar ? (
        <aside
          className={`${"w-64 bg-[#494646] z-10 text-white fixed h-full  p-6  max-[1100px]:shadow-[3px -1px 10px 0px #0f0f0f]"}  `}
        >
          <div className="min-[1100px]:hidden mb-[20px]">
            <span
              className="cursor-pointer"
              onClick={() => setShowSidebar(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.6}
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
            <ul className="text-xl">
              <li className="mb-3">
                <Link href="/dashboard" className="hover:underline">
                  Acceuil
                </Link>
              </li>

              <li className="mb-3">
                <Link href="/dashboard/produits" className="hover:underline">
                  Produits
                </Link>
              </li>

              <li className="mb-3">
                <Link
                  href="/dashboard/ajouterProduit"
                  className="hover:underline"
                >
                  Ajouter un produit
                </Link>
              </li>
              <li className="mb-3">
                <p href="#" className="text-gray-400">
                  Paiements
                </p>
              </li>
              <li className="mb-3">
                <Link href="/produits" className="hover:underline">
                  Retour au site
                </Link>
              </li>
              <li>
                <p
                  onClick={() => setShowBlocDeconnexion(true)}
                  className="hover:underline cursor-pointer"
                >
                  Deconnexion
                </p>
              </li>
            </ul>
          </div>
        </aside>
      ) : (
        ""
      )}
    </>
  );
}
