import {NextApiRequest, NextApiResponse} from "next";
import {query} from "../../../lib/db/db";
import {autenticado} from "../../../lib/autenticacao";

export default autenticado(async function especifico(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query

    try{
        if (!id) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'É necessário fornecer um id'
            });
        }
        const resultado = await query(`
                    SELECT id, nome, ssid, status
                    FROM redes
                    WHERE id = ?`,
            [Number(id)]
        );
        return res.status(200).json({
            sucesso: true,
            mensagem: "Registro específico recuperado com sucesso!",
            rede: resultado
        })
    } catch (e) {
        res.status(404).json({
            sucesso: false,
            mensagem: "Não conseguimos recuperar esse autenticacao!",
            erro: e.message,
            req: req.body
        })
    }
})