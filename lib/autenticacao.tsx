import { verify } from 'jsonwebtoken';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const autenticado = (fn: NextApiHandler) => async (
req: NextApiRequest,
res: NextApiResponse,
) => {
  if(req.cookies.token!){
    //esta pela web
    verify(req.cookies.token!, process.env.JWT_SECRET, async function(err, decoded) {
      if (!err && decoded) {
        return fn(req, res);
      }

      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token inválido',
        erro: JSON.stringify(err),
      });
    });
  }else if(req.headers.authorization!){
    //esta pelo app
    verify(req.headers.authorization!, process.env.JWT_SECRET, (async function(err, decoded) {
      if (!err && decoded) {
        return fn(req, res);
      }

      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token inválido',
        erro: JSON.stringify(err),
      });
    }));
  }
};
