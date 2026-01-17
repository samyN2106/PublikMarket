"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useVerifierPwd from "@/hooks/useVerifierPwd";
import ActionUpdatePassword from "@/app/actions/ActionUpdate-password";
import { useParams } from "next/navigation";
export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { token } = useParams();
  const [pending, setPending] = useState(false);
  const [motDePassChanged, setMotDePassChanged] = useState(false);

  const { setValuePwd, niveauPwd, getBarColor } = useVerifierPwd();

  const passwordValue = watch("password", "");
  useEffect(() => {
    setValuePwd(passwordValue);
  }, [passwordValue]);

  const onSubmit = async (data) => {
    setPending(true);
    try {
      const rep = await ActionUpdatePassword({
        token: token,
        password: data.password,
      });
      if (!rep.successs) alert(rep.message);
      if (rep.successs) setMotDePassChanged(true);
    } catch (error) {
      console.log(error);
    } finally {
      setPending(false);
    }
  };

  if (motDePassChanged)
    return (
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Mot de passe modifié avec succès
          </h2>
        </div>
      </div>
    );

  return (
    <div className=" p-6 flex h-screen justify-center items-center bg-[#0000007a]">
      <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden bg-white w-[600px] relative">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Reinitialisation de mot de passe
            </h2>
          </div>
        </div>

        <form className="p-[20px]" onSubmit={handleSubmit(onSubmit)}>
          {/* champ mot de passe */}
          <div className="mb-4">
            <label
              className="block text-slate-900 text-sm font-medium mb-2"
              for="password"
            >
              Entrez un mot de pass de Reinitialisation
            </label>
            <input
              {...register("password", {
                required: "Mot de passe requis",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
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

          <div className="flex gap-[20px] mt-4">
            <button
              type="submit"
              className="cursor-pointer w-full py-2.5 px-4 rounded-md flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-sm text-white font-medium transition-colors"
            >
              {pending ? "Chargement....." : "Reinitialiser le mot de passe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  // )}
}
