import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tasers = await prisma.taser.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(tasers);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar dispositivos Taser no banco de dados." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { numeroSerie, modelo, patrimonio, status, subunidade, observacao } = body;

    if (!numeroSerie) {
      return NextResponse.json(
        { error: "O número de série é obrigatório." },
        { status: 400 }
      );
    }

    const novoTaser = await prisma.taser.create({
      data: {
        numeroSerie: numeroSerie.toUpperCase().trim(),
        modelo: modelo || "TASER 10",
        patrimonio: patrimonio || null,
        status: status || "Disponível",
        subunidade: subunidade || "Reserva de Armas / 17º BPM",
        observacao: observacao || null,
      },
    });

    return NextResponse.json(novoTaser, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao cadastrar Taser no banco de dados." },
      { status: 500 }
    );
  }
}