import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db/db';
import { autenticado } from '../../../lib/autenticacao';

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
        SELECT id, nome, ssid, status
        FROM redes`,
    );
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Lista recuperada com sucesso!',
      redes: resultado,
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
  const { nome, ssid, status } = JSON.parse(req.body);

  try {
    if (!nome || !ssid || !status) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Preencha os campos obrigatórios.',
        enviado: req,
      });
    }

    const resultado: any = await query(`
                INSERT INTO redes (nome, ssid, status)
                VALUES (?, ?, ?)`,
      [nome, ssid, status],
    );

    const rede = await query(
      `SELECT nome, ssid, status
       FROM redes
       WHERE id = ?`,
      [resultado.insertId],
    );

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Registro cadastrado com sucesso!',
      rede: rede,
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
  const { id, nome, ssid, status } = JSON.parse(req.body);

  try {
    if (!id || !nome || !ssid || !status) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Preencha os campos obrigatórios.',
        enviado: req,
      });
    }

    const resultado = await query(`
                UPDATE redes
                set nome=?,
                    ssid=?,
                    status=?
                WHERE id = ?`,
      [nome, ssid, status, id],
    );
    const rede = await query(
      `SELECT *
       FROM redes
       WHERE id = ?`,
      id,
    );
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Registro atualizado com sucesso!',
      rede: rede,
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
                FROM redes
                WHERE id = ?`,
      id,
    );
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Registro excluído com sucesso!',
      rede: resultado,
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