import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createSessionToken } from "@/app/auth"; // Ajuste o caminho se necessário

export async function POST(req: Request) {
  const { email, password } = await req.json();

//vai lei do banco de dados e analisar se tem o usuario no .json
  const filePath = path.join(process.cwd(), "users.json");
  const fileData = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(fileData);

//ve se tem usuario dentro do json
  const user = users.find((u) => u.email === email);

  // Verificação de senha
  if (!user || user.password !== password) {
    return NextResponse.json(
      { message: "E-mail ou senha incorretos" },
      { status: 401 }
    );
  }

  //cria sessão para ser autenticado e no middleware
  await createSessionToken({ sub: user.id, email: user.email });

  return NextResponse.json({ message: "Login realizado com sucesso!" });
}
