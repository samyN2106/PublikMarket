import FreeForm from "@/components/formInscrip/FreeForm";

export default async function Inscription({ params }) {
  const { plan } = await params;
  if (
    !plan ||
    (plan !== "gratuit" && plan !== "standart" && plan !== "premium")
  ) {
    return notFound();
  }

  if (plan === "gratuit") {
    return <FreeForm />;
  }
  // else {
  //   if (plan === "standart" || plan === "premium") {
  //     return <FormInscripPayant offre={plan} />;
  //   }
  // }
}
