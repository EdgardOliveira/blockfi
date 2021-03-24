import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db/db';
import { autenticado } from '../../../lib/autenticacao';
import { hash } from 'bcryptjs';

export default autenticado(async function redes(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      listar(res);
      break;
    case 'POST':
      salvar(req, res);
      break;
    case 'PUT':
      atualizar(req, res);
      break;
    case 'DELETE':
      excluir(req, res);
      break;
  }
});

export async function listar(res: NextApiResponse) {
  try {
    const resultado = await query(`
        SELECT id, nome, sobrenome, email, grupo_id
        FROM usuarios`,
    );
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Lista recuperada com sucesso!',
      usuarios: resultado,
    });
  } catch (e) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Não conseguimos recuperar a lista!',
      erro: e.message,
    });
  }
}

export async function salvar(req: NextApiRequest, res: NextApiResponse) {
  const { nome, sobrenome, email, senha, grupo_id } = JSON.parse(req.body);

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
        `SELECT nome, sobrenome, email, grupo_id
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

export async function atualizar(req: NextApiRequest, res: NextApiResponse) {
  const { id, nome, sobrenome, email, senha, grupo_id } = JSON.parse(req.body);

  try {
    if (!id || !nome || !sobrenome || !email || !senha || !grupo_id) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Preencha os campos obrigatórios.',
        enviado: req,
      });
    }

    const resultado = await query(`
                UPDATE usuarios
                set nome=?,
                    sobrenome=?,
                    email=?,
                    senha=?,
                    grupo_id=?
                WHERE id = ?`,
      [nome, sobrenome, email, senha, grupo_id, id],
    );
    const usuario = await query(
      `SELECT *
       FROM usuarios
       WHERE id = ?`,
      id,
    );
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Registro atualizado com sucesso!',
      usuario: usuario,
    });
  } catch (e) {
    res.status(400).json({
      sucesso: false,
      mensagem: 'Não conseguimos atualizar!',
      erro: e.message,
      req: req.body,
    });
  }
}

export async function excluir(req: NextApiRequest, res: NextApiResponse) {
  const { id } = JSON.parse(req.body);

  try {
    if (!id) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'É necessário fornecer um id',
      });
    }
    const resultado = await query(`
                DELETE
                FROM usuarios
                WHERE id = ?`,
      id,
    );
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Registro excluído com sucesso!',
      usuario: resultado,
    });
  } catch (e) {
    res.status(400).json({
      sucesso: false,
      mensagem: 'Não conseguimos excluir!',
      erro: e.message,
      req: req.body,
    });
  }
}