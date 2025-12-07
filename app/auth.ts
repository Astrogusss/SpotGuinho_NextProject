import * as jose from 'jose';
import { cookies } from 'next/headers';

//abrir sessão de cookie
export async function openSessionToken(token: string) {
  const secret = new TextEncoder().encode(process.env.TOKEN);
  const { payload } = await jose.jwtVerify(token, secret);
  return payload;
}

//funcao para criar a sessão e salvar nos cookie
export async function createSessionToken(payload = {}) {
  const secret = new TextEncoder().encode(process.env.TOKEN);

  const session = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);

  const { exp } = await openSessionToken(session);

  const cookieStore = await cookies();

  cookieStore.set('session', session, {
    expires: (exp as number) * 1000,
    path: '/',
    httpOnly: true,
  });
}

//validar se a sessão existe
export async function isSessionValid() {
  const sessionCookie = (await cookies()).get('session');

  if (sessionCookie) {
    const { value } = sessionCookie;
    try {
      const { exp } = await openSessionToken(value);
      const currentDate = new Date().getTime();
      return (exp as number) * 1000 > currentDate;
    } catch (error) {
      return false; // Token inválido ou adulterado
    }
  }

  return false;
}