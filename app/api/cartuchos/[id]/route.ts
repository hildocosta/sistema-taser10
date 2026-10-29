import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, numeroBoletim, urlBoletim, dataUso } = body;

    const cartuchoId = Number(id);

    if (isNaN(cartuchoId)) {
      return NextResponse.json(
        { error: "ID inválido." },
        { status: 400 }
      );
    }

    const cartuchoAtualizado = await prisma.cartucho.update({
      where: { id: cartuchoId },
      data: {
        status,
        numeroBoletim: status === "Utilizado" ? numeroBoletim : null,
        urlBoletim: status === "Utilizado" ? urlBoletim : null,
        dataUso: status === "Utilizado" ? (dataUso ? new Date(dataUso) : new Date()) : null,
      },
    });

    return NextResponse.json(cartuchoAtualizado);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar registro do cartucho no banco de dados." },
      { status: 500 }
    );
  }
}