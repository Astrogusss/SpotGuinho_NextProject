import { isSessionValid } from "../auth"; // Ajuste o caminho se necessário (ex: "@/app/auth")
import { redirect } from "next/navigation";

export default async function GuinhoPage() {
  //validar a sessão
  const isLogged = await isSessionValid();

  if (!isLogged) {
    redirect("/Login");
  }

  return <div>voce passou</div>;
}
