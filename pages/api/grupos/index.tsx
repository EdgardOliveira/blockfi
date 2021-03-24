import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db/db';
import { autenticado } from '../../../lib/autenticacao';

export default autenticado(async function grupos(req: NextApiRequest, res: NextApiResponse) {
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
        SELECT id, nome, descricao, status
        FROM grupos`,
    );
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Lista recuperada com sucesso!',
      grupos: resultado,
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
  const { nome, descricao, status } = JSON.parse(req.body);

  try {
    if (!descricao || !nome || !status) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Preencha os campos obrigatórios.',
        enviado: req,
      });
    }

    const resultado: any = await query(`
                INSERT INTO grupos (nome, descricao, status)
                VALUES (?, ?, ?)`,
      [nome, descricao, status],
    );

    const grupo = await query(
      `SELECT nome, descricao, status
       FROM grupos
       WHERE id = ?`,
      [resultado.insertId],
    );

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Registro cadastrado com sucesso!',
      grupo: grupo,
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
  const { id, nome, descricao,  status } = JSON.parse(req.body);

  try {
    if (!id || !descricao || !nome || !status) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Preencha os campos obrigatórios.',
        enviado: req,
      });
    }

    const resultado = await query(`
                UPDATE grupos
                set descricao=?,
                    nome=?,
                    status=?
                WHERE id = ?`,
      [descricao, nome, status, id],
    );

    const grupo = await query(
      `SELECT *
       FROM grupos
       WHERE id = ?`,
      id,
    );

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Registro atualizado com sucesso!',
      grupo: grupo,
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
                FROM grupos
                WHERE id = ?`,
      id,
    );
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Registro excluído com sucesso!',
      grupo: resultado,
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