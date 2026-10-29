import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cartuchos = await prisma.cartucho.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(cartuchos);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar cartuchos no banco de dados." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { numeroSerie, modelo, alcance, subunidade, observacao, validade } = body;

    if (!numeroSerie) {
      return NextResponse.json(
        { error: "O número de série é obrigatório." },
        { status: 400 }
      );
    }

    const novoCartucho = await prisma.cartucho.create({
      data: {
        numeroSerie: numeroSerie.toUpperCase().trim(),
        modelo: modelo || "OPERACIONAL 25FT",
        alcance: alcance || "13,72 Metros (25ft)",
        subunidade: subunidade || "Reserva de Armas / 17º BPM",
        observacao: observacao || null,
        validade: validade ? new Date(validade) : null,
        status: "Disponível",
      },
    });

    return NextResponse.json(novoCartucho, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao cadastrar cartucho no banco de dados." },
      { status: 500 }
    );
  }
}