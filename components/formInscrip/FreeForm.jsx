"use client";
import ReCAPTCHA from "react-google-recaptcha";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useVerifierPwd from "@/hooks/useVerifierPwd";
import { ActionFreeInscrip } from "@/app/actions/ActionFreeInscrip";
import { createCookie } from "@/app/actions/ActionCreateCookies";
import ActionEnvoiEmail from "@/app/actions/ActionEnvoiEmailWelcom";
export default function FreeForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const passwordValue = watch("password", "");
  const [pending, setPending] = useState(false);
  const [errorServeur, setErrorServeur] = useState(null);
  const router = useRouter();
  const { setValuePwd, niveauPwd, getBarColor } = useVerifierPwd();
  const [captchaToken, setCaptchaToken] = useState(null);

  useEffect(() => {
    setValuePwd(passwordValue);
  }, [passwordValue]);

  const onSubmit = async (data) => {
    if (!captchaToken)
      alert("Veuillez valider le reCAPTCHA avant de soumettre le formulaire.");
    data.captchaToken = captchaToken;
    setPending(true);
    try {
      const reponse = await ActionFreeInscrip(data);
      if (!reponse.success) setErrorServeur(reponse.error);
      if (reponse.success) {
        ActionEnvoiEmail(reponse.email);
        createCookie({
          NomCookies: "myapp_session",
          CookiesValue: reponse.boutiqueId,
        });
        router.push("/produits");

        // function pour creer le cookie apres l'inscription
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="h-screen  flex flex-col bg-[#0000007a] justify-center relative">
      <div>
        <div
          className="max-w-xl mx-auto bg-white rounded-xl max-[630px]:mx-5"
          style={{ boxShadow: "0px 0px 20px 0px" }}
        >
          {/* afficher le messsage d'erreur du serveur */}
          {errorServeur && (
            <div className="flex items-center px-2.5 py-[5px]">
              <Image
                src="/message-derreur.png"
                alt="icone Erreur formulaire"
                width={50}
                height={50}
              ></Image>
              <p className="text-red-500 text-xl ml-2.5">{errorServeur}</p>
            </div>
          )}

          <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-linear-to-r from-purple-500 to-indigo-600 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Completez avec votre paiement
                </h2>
                <p className="text-sm text-slate-100 mt-2">
                  Processus facile, rapide et securise
                </p>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">Gratuit</p>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* champs nom de la boutique */}

                <div className="mb-4">
                  <label className="block text-slate-900 text-sm font-medium mb-2">
                    Entrez le nom de votre boutique
                  </label>
                  <input
                    {...register("boutique", {
                      required: "Champs requis",
                    })}
                    type="text"
                    className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-indigo-600"
                  />
                  {errors.boutique && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.boutique.message}
                    </p>
                  )}
                </div>

                {/* champ  email  */}
                <div className="mb-4">
                  <label className="block text-slate-900 text-sm font-medium mb-2">
                    Entrez votre email
                  </label>
                  <input
                    {...register("email", {
                      required: "Email requis",
                    })}
                    type="email"
                    className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-indigo-600"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* champ mot de passe */}
                <div className="mb-4">
                  <label
                    className="block text-slate-900 text-sm font-medium mb-2"
                    for="password"
                  >
                    Entrez un mot de pass
                  </label>
                  <input
                    {...register("password", {
                      required: "Mot de passe requis",
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                        message:
                          "Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 symbole (@$!%*?&)",
                      },
                    })}
                    type="password"
                    className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-indigo-600"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                  {niveauPwd != "" ? (
                    <div className="flex items-center justify-between">
                      <span
                        style={{ transition: "all 0.5s ease" }}
                        className={`${getBarColor()} `}
                      ></span>
                      <small className="ml-[5px]">{niveauPwd}</small>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {/* champ confirmation mot de passe */}
                <div className="mb-4">
                  <label className="block text-slate-900 text-sm font-medium mb-2">
                    Confirmez le mot de pass
                  </label>
                  <input
                    {...register("passwordConfirm", {
                      required: "confirmez le mot de pass",
                      validate: (value) =>
                        value === watch("password") ||
                        "Le mot de passe ne correspondent pas",
                    })}
                    type="password"
                    className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-indigo-600"
                  />
                  {errors.passwordConfirm && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.passwordConfirm.message}
                    </p>
                  )}
                </div>

                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  hl="fr"
                  onChange={(token) => setCaptchaToken(token)}
                />

                {/* bloc de soumission du formulaire */}
                <div className="flex flex-col space-y-4 mt-4">
                  <button
                    // disabled={pending || !captchaToken}
                    type="submit"
                    className="cursor-pointer w-full py-2.5 px-4 rounded-md flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-sm text-white font-medium transition-colors"
                  >
                    {pending
                      ? "Inscription en cours..."
                      : "Commencer Gratuitement"}
                  </button>

                  <div className="flex items-center justify-center text-slate-500 text-sm">
                    <span>Processus facile, rapide et securise</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
