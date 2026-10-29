-- CreateTable
CREATE TABLE "cartuchos" (
    "id" SERIAL NOT NULL,
    "item" INTEGER,
    "descricao" VARCHAR(255) DEFAULT 'CARTUCHO',
    "marca" VARCHAR(100) DEFAULT 'TASER',
    "modelo" VARCHAR(100),
    "numero_serie" VARCHAR(100) NOT NULL,
    "validade" TIMESTAMP(3),
    "alcance" VARCHAR(50),
    "status" VARCHAR(50) NOT NULL DEFAULT 'Disponível',
    "subunidade" VARCHAR(255) DEFAULT 'Reserva de Armas / 17º BPM',
    "numero_boletim" VARCHAR(100),
    "url_boletim" TEXT,
    "data_uso" TIMESTAMP(3),
    "observacao" TEXT,
    "exclusao" VARCHAR(10),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cartuchos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasers" (
    "id" SERIAL NOT NULL,
    "numero_serie" VARCHAR(100) NOT NULL,
    "modelo" VARCHAR(100) NOT NULL,
    "patrimonio" VARCHAR(255),
    "subunidade" VARCHAR(255),
    "status" VARCHAR(100) DEFAULT 'Disponível',
    "situacao" VARCHAR(100) DEFAULT 'Operacional',
    "observacao" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cartuchos_numero_serie_key" ON "cartuchos"("numero_serie");

-- CreateIndex
CREATE UNIQUE INDEX "tasers_numero_serie_key" ON "tasers"("numero_serie");
