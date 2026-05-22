import type { Request, Response } from "express";
import {
  getNavigationNodeService,
  deleteAllNodesService,
  createSupportContactService,
} from "@/services/publicService.js";

export const getPublicNodes = async (
  req: Request<{ id?: string }>,
  res: Response,
) => {
  // The ID can be '0', a number, or undefined if the route is /api/options/
  const { id } = req.params;

  const nodeId = !id || id === "0" ? null : parseInt(id, 10);

  if (id && id !== "0" && isNaN(nodeId as number)) {
    return res.status(400).json({ error: "O ID fornecido é inválido." });
  }

  try {
    const result = await getNavigationNodeService(nodeId);

    if (!result) {
      return res.status(404).json({ error: "Conteúdo não encontrado." });
    }

    res.json(result);
  } catch (err) {
    console.error("Erro na navegação do chat:", err);
    res.status(500).json({ error: "Erro interno ao processar navegação." });
  }
};

export const deleteALL = async (_req: Request, res: Response) => {
  try {
    await deleteAllNodesService();
    res.status(200).json({ message: "Banco deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar banco:", error);
    res.status(500).json({ erro: "Falha ao deletar banco." });
  }
};

export const createSupportContact = async (req: Request, res: Response) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res
        .status(400)
        .json({ error: "Os campos 'email' e 'message' são obrigatórios." });
    }

    // Adicionar validação de email aqui seria uma boa prática

    await createSupportContactService(email, message);

    res
      .status(201)
      .json({
        message:
          "Pergunta enviada com sucesso. Você receberá uma resposta no e-mail informado.",
      });
  } catch (error) {
    console.error("Erro ao criar contato de suporte:", error);
    res.status(500).json({ error: "Erro ao criar contato de suporte" });
  }
};
