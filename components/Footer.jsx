import Button from "./Button";
import { cookies } from "next/headers";
export default async function Footer() {
  const setCookies = await cookies();
  const session = setCookies.get("myapp_session")?.value;
  return (
    <footer className="mt-20 xl:mt-32 mx-auto w-full relative text-center bg-gray-200 text-[#646464]">
      <div className="px-6 py-8 md:py-14 xl:pt-20 xl:pb-12">
        <h2 className="font-bold text-3xl xl:text-4xl leading-snug mb-[40px]">
          Rejoignez notre communauté de vendeurs et acheteurs passionnés !
        </h2>

        {session ? (
          <Button href="/dashboard">Publier un produit</Button>
        ) : (
          <Button href="/">Publier un produit</Button>
        )}

        <div className="mt-[40px] xl:mt-20">
          <p className="mt-7 text-base">© 2025 XYZ, LLC</p>
        </div>
      </div>
    </footer>
  );
}
