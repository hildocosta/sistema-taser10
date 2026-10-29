import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, subunidade, observacao } = body;

    const taserId = Number(id);

    if (isNaN(taserId)) {
      return NextResponse.json(
        { error: "ID inválido." },
        { status: 400 }
      );
    }

    const taserAtualizado = await prisma.taser.update({
      where: { id: taserId },
      data: {
        ...(status && { status }),
        ...(subunidade && { subunidade }),
        ...(observacao !== undefined && { observacao }),
      },
    });

    return NextResponse.json(taserAtualizado);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar registro do Taser no banco de dados." },
      { status: 500 }
    );
  }
}