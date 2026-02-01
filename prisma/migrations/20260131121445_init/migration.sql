-- CreateTable
CREATE TABLE "Paper" (
    "id" TEXT NOT NULL,
    "paperType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "grammage" INTEGER NOT NULL,
    "price64x90" DECIMAL(10,4) NOT NULL,
    "price65x92" DECIMAL(10,4) NOT NULL,
    "price70x102" DECIMAL(10,4) NOT NULL,
    "price72x102" DECIMAL(10,4) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinishingDigital" (
    "id" TEXT NOT NULL,
    "finishingType" TEXT NOT NULL,
    "pageRangeMin" INTEGER NOT NULL,
    "pageRangeMax" INTEGER NOT NULL,
    "quantityMin" INTEGER NOT NULL,
    "quantityMax" INTEGER NOT NULL,
    "perUnitCost" DECIMAL(10,4) NOT NULL,
    "fixedCost" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinishingDigital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinishingOffset" (
    "id" TEXT NOT NULL,
    "finishingType" TEXT NOT NULL,
    "pageRangeMin" INTEGER NOT NULL,
    "pageRangeMax" INTEGER NOT NULL,
    "quantityMin" INTEGER NOT NULL,
    "quantityMax" INTEGER NOT NULL,
    "perUnitCost" DECIMAL(10,4) NOT NULL,
    "fixedCost" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinishingOffset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transport" (
    "id" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "weightMin" DECIMAL(10,2) NOT NULL,
    "weightMax" DECIMAL(10,2) NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineSettings" (
    "id" TEXT NOT NULL,
    "pressFormat" TEXT NOT NULL,
    "sheetsPerHour" INTEGER NOT NULL,
    "costPerPlate" DECIMAL(10,2) NOT NULL,
    "hourlyRate" DECIMAL(10,2) NOT NULL,
    "wasteFactor" DECIMAL(5,4) NOT NULL,
    "makeReadySheets" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MachineSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackagingCost" (
    "id" TEXT NOT NULL,
    "packagingType" TEXT NOT NULL,
    "perUnitCost" DECIMAL(10,4) NOT NULL,
    "fixedCost" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackagingCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "printMode" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "formatWidth" DECIMAL(6,2) NOT NULL,
    "formatHeight" DECIMAL(6,2) NOT NULL,
    "interiorPages" INTEGER NOT NULL,
    "coverPages" INTEGER NOT NULL,
    "rabatWidth" DECIMAL(6,2),
    "interiorPaperType" TEXT NOT NULL,
    "interiorGrammage" INTEGER NOT NULL,
    "coverPaperType" TEXT,
    "coverGrammage" INTEGER,
    "interiorColors" TEXT NOT NULL,
    "coverColors" TEXT,
    "bindingType" TEXT NOT NULL,
    "laminationOrientation" TEXT,
    "laminationFinish" TEXT,
    "productType" TEXT,
    "foldType" TEXT,
    "foldCount" INTEGER,
    "secondaryFoldType" TEXT,
    "packagingType" TEXT,
    "deliveries" JSONB,
    "weightPerCopy" DECIMAL(10,4) NOT NULL,
    "totalWeight" DECIMAL(10,2) NOT NULL,
    "paperCost" DECIMAL(10,2) NOT NULL,
    "printingCost" DECIMAL(10,2) NOT NULL,
    "bindingCost" DECIMAL(10,2) NOT NULL,
    "laminationCost" DECIMAL(10,2) NOT NULL,
    "packagingCost" DECIMAL(10,2) NOT NULL,
    "deliveryCost" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "marginPercent" DECIMAL(5,4) NOT NULL,
    "marginAmount" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(10,4) NOT NULL,
    "pressFormat" TEXT,
    "plateCount" INTEGER,
    "makeReadyCost" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Paper_paperType_category_idx" ON "Paper"("paperType", "category");

-- CreateIndex
CREATE UNIQUE INDEX "Paper_paperType_category_grammage_key" ON "Paper"("paperType", "category", "grammage");

-- CreateIndex
CREATE INDEX "FinishingDigital_finishingType_pageRangeMin_quantityMin_idx" ON "FinishingDigital"("finishingType", "pageRangeMin", "quantityMin");

-- CreateIndex
CREATE INDEX "FinishingOffset_finishingType_pageRangeMin_quantityMin_idx" ON "FinishingOffset"("finishingType", "pageRangeMin", "quantityMin");

-- CreateIndex
CREATE INDEX "Transport_department_idx" ON "Transport"("department");

-- CreateIndex
CREATE UNIQUE INDEX "Transport_department_weightMin_weightMax_key" ON "Transport"("department", "weightMin", "weightMax");

-- CreateIndex
CREATE UNIQUE INDEX "MachineSettings_pressFormat_key" ON "MachineSettings"("pressFormat");

-- CreateIndex
CREATE UNIQUE INDEX "PackagingCost_packagingType_key" ON "PackagingCost"("packagingType");

-- CreateIndex
CREATE INDEX "Quote_createdAt_idx" ON "Quote"("createdAt");

-- CreateIndex
CREATE INDEX "Quote_printMode_idx" ON "Quote"("printMode");

-- CreateIndex
CREATE UNIQUE INDEX "Config_key_key" ON "Config"("key");
