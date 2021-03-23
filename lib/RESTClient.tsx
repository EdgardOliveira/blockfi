import fetch from 'isomorphic-unfetch';
import { NextPageContext } from "next";
import Router from 'next/router';

let cookie;

export async function getCookies(url: string, ctx: NextPageContext) {
  cookie = ctx.req?.headers.cookie;

  const resp = await fetch(url, {
    headers: {
      cookie: cookie!
    }
  });

  if(resp.status === 401 && !ctx.req) {
    console.log('Cliente...')
    Router.replace('/login');
    return {};
  }

  if(resp.status === 401 && ctx.req) {
    console.log('Servidor...')
    ctx.res?.writeHead(302, {
      Location: '/login'
    });
    ctx.res?.end();
    return;
  }

  const json = await resp.json();
  return json;
}

export async function obterDadosId(url:string) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      cookie: cookie!
    },
    // credentials: 'same-origin',
  })
  const json = await res.json();
  return json;
}

export async function postarDados(url:string, corpo) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      cookie: cookie!
    },
    // credentials: 'same-origin',
    body: JSON.stringify(corpo),
  })
  const json = await res.json();
  return json;
}

export async function atualizarDados(url:string, corpo) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      cookie: cookie!
    },
    // credentials: 'same-origin',
    body: JSON.stringify(corpo),
  })
  const json = await res.json();
  return json;
}

export async function excluirDados(url:string, id:number){
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        cookie: cookie!
      },
      // credentials: 'same-origin',
      body: JSON.stringify({
        id: id
      }),
    })
    const json = await res.json();
    return json;
}