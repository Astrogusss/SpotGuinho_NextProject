import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
    //verifica qual rota o usuario ta querendo fazer
  const path = request.nextUrl.pathname;

    //lista de quais rotas sao publicas
  const publicRoutes = ['/Login', '/Create', '/', '/api/login', '/api/create'];

  // ver se a rota atual é publica
  const isPublic = publicRoutes.includes(path);

  // pegar cookie para validar a sessão 
  const sessionCookie = request.cookies.get('session')?.value;

  // validar o token
  let sessionIsValid = false;
  if (sessionCookie) {
    try {
      const secret = new TextEncoder().encode(process.env.TOKEN);
      await jose.jwtVerify(sessionCookie, secret);
      sessionIsValid = true;
    } catch (error) {
      // Token inválido ou expirado
      sessionIsValid = false;
    }
  }


  //caso ele nao esteja logado
  if (!isPublic && !sessionIsValid) {
    return NextResponse.redirect(new URL('/Login', request.url));
  }

 
  //caso vc esteja logado e quiser ir para a tela de login, ele vai te mandar pra área logado, para nao ter dois logins
  if (sessionIsValid && (path === '/Login' || path === '/Create')) {
    return NextResponse.redirect(new URL('/guinho', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};