import { compare } from 'bcrypt';
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
        const usuario: any = await query(
            'SELECT * FROM usuarios where email = ?',
            [email]
        );

        compare(senha, usuario[0].senha, function(err, result) {
            if (!err && result) {
                const claims = { sub: usuario.id, myPersonEmail: usuario.email };
                const jwt = sign(claims, process.env.JWT_SECRET, { expiresIn: '1h' });

                res.setHeader('Set-Cookie', cookie.serialize('token', jwt, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'strict',
                    maxAge: 3600,
                    path: '/'
                }));

                res.status(200).json({
                    sucesso: true,
                    mensagem: 'Usuário autenticado com sucesso!',
                    token: jwt,
                    usuario: usuario
                });
            } else {
                res.status(401).json({
                    sucesso: false,
                    mensagem: "Credenciais inválidas",
                    enviado: req.body
                })
            }
        });
    } catch (e) {
        res.status(405).json({
            sucesso: false,
            mensagem: "Ocorreu um erro ao tentar fazer login.",
            erro: e.message,
            req: req.body
        })
    }
}

// export default function Signup() {
//     const nomeRef = useRef<HTMLInputElement>(null);
//     const sobrenomeRef = useRef<HTMLInputElement>(null);
//     const emailRef = useRef<HTMLInputElement>(null);
//     const senhaRef = useRef<HTMLInputElement>(null);
//     const grupoRef = useRef<HTMLInputElement>(null);
//     const [message, setMessage] = useState<any>(null);
//     async function handleLogin() {
//         const resp = await fetch('http://localhost:3000/api/autenticacao/registro', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 nome: nomeRef.current?.value,
//                 sobrenome: sobrenomeRef.current?.value,
//                 email: emailRef.current?.value,
//                 senha: senhaRef.current?.value,
//                 grupo_id: grupoRef.current?.value,
//             })
//         });
//         const json = await resp.json();
//         setMessage(json);
//     }
//
//     return (
//         <div>
//             <h1>Create a new user!!</h1>
//             {JSON.stringify(message)}
//             <input type="text" placeholder="nome" ref={nomeRef} />
//             <input type="text" placeholder="sobrenome" ref={sobrenomeRef} />
//             <input type="text" placeholder="email" ref={emailRef} />
//             <input type="password" placeholder="senha" ref={senhaRef} />
//             <input type="text" placeholder="grupo" ref={grupoRef} />
//             <button onClick={handleLogin}>Login</button>
//         </div>
//     );
// }