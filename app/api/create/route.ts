import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  //pegar os dados do front
  const body = await req.json();
  const { email, password } = body;

  //definir caminho
  const filePath = path.join(process.cwd(), "users.json");

  //Lê o arquivo atual
  const fileData = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(fileData);

  //aqui verificamos se o email ja tem alguem cadastrado
  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    return NextResponse.json(
      { message: "Usuário já cadastrado" },
      { status: 400 }
    );
  }

  //adicionar usuario no json
  const newUser = { id: Date.now(), email, password };
  users.push(newUser);

  //escrever
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  //manda mensagem pro front
  return NextResponse.json(
    { message: "Cadastro realizado com sucesso!" },
    { status: 201 }
  );
}
