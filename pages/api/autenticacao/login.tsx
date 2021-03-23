// import { compare } from 'bcrypt';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import {query} from '../../../lib/db/db';
import cookie from 'cookie';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "POST":
            verificarCredenciais(req, res);
            break;
        default:
            res.status(405).json({message: 'Essa rota só oferece suporte a POST'});
    }
}

export async function verificarCredenciais(req: NextApiRequest, res: NextApiResponse) {
    const {email, senha} = req.body;
    try {
        if (!email || !senha ) {
            return await res.status(400).json({
                sucesso: false,
                mensagem: 'Preencha os campos obrigatórios.',
                enviado: req,
            });
        }

        const usuario: any = await query(
            'SELECT * FROM usuarios where email = ?',
            [email]
        );

        compare(senha, usuario[0].senha, async function(err, result) {
            if (!err && result) {
                const claims = { sub: usuario.id, myPersonEmail: usuario.email };
                const jwt = sign(claims, process.env.JWT_SECRET, { expiresIn: '1h' });

                // res.setHeader('Source', '/api/(.*)');
                res.setHeader('Access-Control-Allow-Credentials', 'true');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
                res.setHeader(
                  'Access-Control-Allow-Headers',
                  'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
                );

                res.setHeader('Set-Cookie', cookie.serialize('token', jwt, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'strict',
                    maxAge: 3600,
                    path: '/'
                }));

                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Autenticado com sucesso!',
                    token: jwt,
                    usuario: usuario
                });
            } else {
                return res.status(401).json({
                    sucesso: false,
                    mensagem: "Credenciais inválidas",
                    enviado: req.body
                })
            }
        });
    } catch (e) {
        return res.status(405).json({
            sucesso: false,
            mensagem: "Ocorreu um erro ao tentar fazer login.",
            erro: e.message,
            req: req.body
        })
    }
}