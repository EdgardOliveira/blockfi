// import { hash } from 'bcrypt';
import { hash } from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db/db';

export default async function registro(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      salvar(req, res);
      break;
    default:
      res.status(405).json({ message: 'Essa rota só oferece suporte a POST' });
  }
}

export async function salvar(req: NextApiRequest, res: NextApiResponse) {
  const { nome, sobrenome, email, senha, grupo_id } = req.body;

  try {

    if (!nome || !sobrenome || !email || !senha || !grupo_id) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Preencha os campos obrigatórios.',
        enviado: req,
      });
    }

    hash(senha, 12, async function(err, hash) {
      const resultado: any = await query(`
                  INSERT INTO usuarios (nome, sobrenome, email, senha, grupo_id)
                  VALUES (?, ?, ?, ?, ?)`,
        [nome, sobrenome, email, hash, grupo_id],
      );

      const usuario = await query(
        `SELECT nome, sobrenome, email, senha, grupo_id
         FROM usuarios
         WHERE id = ?`,
        [resultado.insertId],
      );

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Registro cadastrado com sucesso!',
        usuario: usuario,
      });
    });

  } catch (e) {
    res.status(405).json({
      sucesso: false,
      mensagem: 'Não conseguimos cadastrar!',
      erro: e.message,
      enviado: req.body,
    });
  }
}