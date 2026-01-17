"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";
import { createCookie } from "@/app/actions/ActionCreateCookies";
import ActionConnexion from "@/app/actions/ActionConnexion";
import Image from "next/image";
import ActionEnvoiEmail from "@/app/actions/ActionEnvoiEmailResetPwd";
export default function Connexion() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [captchaToken, setCaptchaToken] = useState(null);
  const [pswForgot, setPswForgot] = useState(false);
  const [emailDePwdForgot, setEmailDePwdForgot] = useState(null);
  const [erreurConnexion, setErreurConnexion] = useState(false);
  const [erreurServeur, setErreurServeur] = useState(null);
  const [pending, setPending] = useState(false);
  const [emailSend, setEmailSend] = useState(false);

  const handlePwdForgotSubmit = async (e) => {
    e.preventDefault();
    setPending(true);

    if (emailDePwdForgot) {
      const rep = await ActionEnvoiEmail(emailDePwdForgot);
      if (!rep.success) {
        alert(rep.error);
        setPending(false);
      } else {
        setPending(false);
        setEmailSend(true);
      }
    }
  };

  const onSubmit = async (data) => {
    setPending(true);
    try {
      if (!captchaToken)
        alert(
          "Veuillez valider le reCAPTCHA avant de soumettre le formulaire."
        );
      data.captchaToken = captchaToken;

      const reponse = await ActionConnexion(data);
      if (!reponse.success) {
        setErreurConnexion(true);
        setErreurServeur(reponse.error);
      }
      if (reponse.success) {
        createCookie({
          NomCookies: "myapp_session",
          CookiesValue: reponse.message,
        });

        router.push("/produits");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className=" p-6 flex h-screen justify-center items-center bg-[#0000007a]">
      {pswForgot && !emailSend && (
        <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden bg-white w-[600px] relative">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Mot de passe oublié
              </h2>
            </div>
          </div>
          <form className="p-[20px]" onSubmit={handlePwdForgotSubmit}>
            <div className="">
              <label
                className="block text-slate-900 text-sm font-medium mb-2"
                for="email"
              >
                Entrez votre email
              </label>
              <input
                type="email"
                onChange={(e) => setEmailDePwdForgot(e.target.value)}
                value={emailDePwdForgot}
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-indigo-600"
              />
            </div>
            <div className="flex gap-[20px] mt-4">
              <button
                onClick={() => setPswForgot(false)}
                type="button"
                className="cursor-pointer w-full py-2.5 px-4 rounded-md flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-sm text-white font-medium transition-colors"
              >
                Se connecter
              </button>
              <button
                type="submit"
                className="cursor-pointer w-full py-2.5 px-4 rounded-md flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-sm text-white font-medium transition-colors"
              >
                {pending
                  ? "chargement.........."
                  : " Reinitialiser le mot de passe"}
              </button>
            </div>
          </form>
        </div>
      )}

      {emailSend ? (
        <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden bg-white relative px-[30px]">
          Un email vous a été envoyé. Verifiez votre boite mail
        </div>
      ) : (
        ""
      )}

      {!pswForgot && (
        <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden bg-white w-[600px] relative">
          <div>
            {erreurServeur ? (
              <div className="flex items-center px-[10px] py-[5px]">
                <Image
                  src="/message-derreur.png"
                  alt="Erreur formualire"
                  width={50}
                  height={50}
                />
                <p className="text-red-500 text-xl ml-[10px]">
                  {erreurServeur}
                </p>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">Connexion</h2>
            </div>
          </div>

          {erreurConnexion ? (
            <div>
              <small className="text-red-600 text-[17px] mt-1 p-[20px] ">
                email ou mot de pass incorrect
              </small>
            </div>
          ) : (
            ""
          )}

          <form className="p-[20px]" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                className="block text-slate-900 text-sm font-medium mb-2"
                for="email"
              >
                Entrez votre email
              </label>
              <input
                {...register("email", {
                  required: "Email requis",
                })}
                type="email"
                id="email"
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-indigo-600"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

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
                })}
                type="password"
                id="password"
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-indigo-600"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              hl="fr"
              onChange={(token) => setCaptchaToken(token)}
            />

            <div className="flex flex-col space-y-4 mt-4">
              <button
                type="submit"
                disabled={pending}
                className={`cursor-pointer w-full py-2.5 px-4 rounded-md flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-sm text-white font-medium transition-colors
    ${
      pending
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#9e86ba] hover:bg-[#9d92a8]"
    }`}
              >
                {pending ? "Chargement..." : "Se connecter"}
              </button>

              <div className="flex items-center justify-between text-slate-500 text-sm">
                <span
                  onClick={() => setPswForgot(true)}
                  className="hover:underline cursor-pointer font-semibold"
                >
                  mot de passe oublié ?
                </span>
                <span>Processus facile, rapide et securise</span>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
