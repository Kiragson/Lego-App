-- CreateEnum
CREATE TYPE "CollectionSetCondition" AS ENUM ('NEW', 'USED');

-- CreateEnum
CREATE TYPE "CollectionSetBuildStatus" AS ENUM ('ASSEMBLED', 'DISASSEMBLED');

-- CreateEnum
CREATE TYPE "CollectionSetPartsSource" AS ENUM ('ORIGINAL_SET', 'OWNED_PARTS', 'MIXED');

-- CreateEnum
CREATE TYPE "CollectionPartSourceType" AS ENUM ('SET', 'SPARE_PART', 'PURCHASE', 'MOC', 'OTHER');

-- CreateEnum
CREATE TYPE "ExternalSource" AS ENUM ('REBRICKABLE', 'BRICKLINK', 'LEGO', 'LDRAW', 'BRICKOWL', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" UUID NOT NULL,
    "rebrickableId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "part_categories" (
    "id" UUID NOT NULL,
    "rebrickableId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "part_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colors" (
    "id" UUID NOT NULL,
    "rebrickableId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "rgb" TEXT NOT NULL,
    "isTrans" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parts" (
    "id" UUID NOT NULL,
    "rebrickablePartNum" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elements" (
    "id" UUID NOT NULL,
    "rebrickableElementId" TEXT NOT NULL,
    "partId" UUID NOT NULL,
    "colorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "part_relationships" (
    "id" UUID NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "parentPartId" UUID NOT NULL,
    "childPartId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "part_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sets" (
    "id" UUID NOT NULL,
    "rebrickableSetNum" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "numParts" INTEGER,
    "themeId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "id" UUID NOT NULL,
    "rebrickableId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "setId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_parts" (
    "id" UUID NOT NULL,
    "inventoryId" UUID NOT NULL,
    "partId" UUID NOT NULL,
    "colorId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "isSpare" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_sets" (
    "id" UUID NOT NULL,
    "inventoryId" UUID NOT NULL,
    "setId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "minifigs" (
    "id" UUID NOT NULL,
    "rebrickableFigNum" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numParts" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "minifigs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_minifigs" (
    "id" UUID NOT NULL,
    "inventoryId" UUID NOT NULL,
    "minifigId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_minifigs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_part_ids" (
    "id" UUID NOT NULL,
    "partId" UUID NOT NULL,
    "source" "ExternalSource" NOT NULL,
    "externalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "external_part_ids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_color_ids" (
    "id" UUID NOT NULL,
    "colorId" UUID NOT NULL,
    "source" "ExternalSource" NOT NULL,
    "externalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "external_color_ids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_element_ids" (
    "id" UUID NOT NULL,
    "elementId" UUID NOT NULL,
    "source" "ExternalSource" NOT NULL,
    "externalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "external_element_ids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_set_ids" (
    "id" UUID NOT NULL,
    "setId" UUID NOT NULL,
    "source" "ExternalSource" NOT NULL,
    "externalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "external_set_ids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_minifig_ids" (
    "id" UUID NOT NULL,
    "minifigId" UUID NOT NULL,
    "source" "ExternalSource" NOT NULL,
    "externalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "external_minifig_ids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_sets" (
    "id" UUID NOT NULL,
    "collectionId" UUID NOT NULL,
    "setId" UUID NOT NULL,
    "condition" "CollectionSetCondition" NOT NULL DEFAULT 'USED',
    "partsSource" "CollectionSetPartsSource" NOT NULL DEFAULT 'ORIGINAL_SET',
    "buildStatus" "CollectionSetBuildStatus" NOT NULL DEFAULT 'ASSEMBLED',
    "isComplete" BOOLEAN NOT NULL DEFAULT true,
    "hasBox" BOOLEAN NOT NULL DEFAULT false,
    "hasInstructions" BOOLEAN NOT NULL DEFAULT false,
    "purchasePrice" DECIMAL(12,2),
    "purchaseDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_parts" (
    "id" UUID NOT NULL,
    "collectionId" UUID NOT NULL,
    "partId" UUID NOT NULL,
    "colorId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_part_sources" (
    "id" UUID NOT NULL,
    "collectionPartId" UUID NOT NULL,
    "sourceType" "CollectionPartSourceType" NOT NULL,
    "sourceSetId" UUID,
    "quantity" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_part_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage_locations" (
    "id" UUID NOT NULL,
    "collectionId" UUID NOT NULL,
    "parentId" UUID,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storage_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "element_storage" (
    "id" UUID NOT NULL,
    "collectionPartId" UUID NOT NULL,
    "storageLocationId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "element_storage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "collections_userId_idx" ON "collections"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "themes_rebrickableId_key" ON "themes"("rebrickableId");

-- CreateIndex
CREATE INDEX "themes_parentId_idx" ON "themes"("parentId");

-- CreateIndex
CREATE INDEX "themes_name_idx" ON "themes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "part_categories_rebrickableId_key" ON "part_categories"("rebrickableId");

-- CreateIndex
CREATE INDEX "part_categories_name_idx" ON "part_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "colors_rebrickableId_key" ON "colors"("rebrickableId");

-- CreateIndex
CREATE INDEX "colors_name_idx" ON "colors"("name");

-- CreateIndex
CREATE INDEX "colors_rgb_idx" ON "colors"("rgb");

-- CreateIndex
CREATE UNIQUE INDEX "parts_rebrickablePartNum_key" ON "parts"("rebrickablePartNum");

-- CreateIndex
CREATE INDEX "parts_categoryId_idx" ON "parts"("categoryId");

-- CreateIndex
CREATE INDEX "parts_name_idx" ON "parts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "elements_rebrickableElementId_key" ON "elements"("rebrickableElementId");

-- CreateIndex
CREATE INDEX "elements_partId_idx" ON "elements"("partId");

-- CreateIndex
CREATE INDEX "elements_colorId_idx" ON "elements"("colorId");

-- CreateIndex
CREATE UNIQUE INDEX "elements_partId_colorId_key" ON "elements"("partId", "colorId");

-- CreateIndex
CREATE INDEX "part_relationships_parentPartId_idx" ON "part_relationships"("parentPartId");

-- CreateIndex
CREATE INDEX "part_relationships_childPartId_idx" ON "part_relationships"("childPartId");

-- CreateIndex
CREATE INDEX "part_relationships_relationshipType_idx" ON "part_relationships"("relationshipType");

-- CreateIndex
CREATE UNIQUE INDEX "part_relationships_relationshipType_parentPartId_childPartI_key" ON "part_relationships"("relationshipType", "parentPartId", "childPartId");

-- CreateIndex
CREATE UNIQUE INDEX "sets_rebrickableSetNum_key" ON "sets"("rebrickableSetNum");

-- CreateIndex
CREATE INDEX "sets_themeId_idx" ON "sets"("themeId");

-- CreateIndex
CREATE INDEX "sets_year_idx" ON "sets"("year");

-- CreateIndex
CREATE INDEX "sets_name_idx" ON "sets"("name");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_rebrickableId_key" ON "inventories"("rebrickableId");

-- CreateIndex
CREATE INDEX "inventories_setId_idx" ON "inventories"("setId");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_setId_version_key" ON "inventories"("setId", "version");

-- CreateIndex
CREATE INDEX "inventory_parts_inventoryId_idx" ON "inventory_parts"("inventoryId");

-- CreateIndex
CREATE INDEX "inventory_parts_partId_idx" ON "inventory_parts"("partId");

-- CreateIndex
CREATE INDEX "inventory_parts_colorId_idx" ON "inventory_parts"("colorId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_parts_inventoryId_partId_colorId_isSpare_key" ON "inventory_parts"("inventoryId", "partId", "colorId", "isSpare");

-- CreateIndex
CREATE INDEX "inventory_sets_inventoryId_idx" ON "inventory_sets"("inventoryId");

-- CreateIndex
CREATE INDEX "inventory_sets_setId_idx" ON "inventory_sets"("setId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_sets_inventoryId_setId_key" ON "inventory_sets"("inventoryId", "setId");

-- CreateIndex
CREATE UNIQUE INDEX "minifigs_rebrickableFigNum_key" ON "minifigs"("rebrickableFigNum");

-- CreateIndex
CREATE INDEX "minifigs_name_idx" ON "minifigs"("name");

-- CreateIndex
CREATE INDEX "inventory_minifigs_inventoryId_idx" ON "inventory_minifigs"("inventoryId");

-- CreateIndex
CREATE INDEX "inventory_minifigs_minifigId_idx" ON "inventory_minifigs"("minifigId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_minifigs_inventoryId_minifigId_key" ON "inventory_minifigs"("inventoryId", "minifigId");

-- CreateIndex
CREATE INDEX "external_part_ids_partId_idx" ON "external_part_ids"("partId");

-- CreateIndex
CREATE INDEX "external_part_ids_source_idx" ON "external_part_ids"("source");

-- CreateIndex
CREATE UNIQUE INDEX "external_part_ids_source_externalId_key" ON "external_part_ids"("source", "externalId");

-- CreateIndex
CREATE INDEX "external_color_ids_colorId_idx" ON "external_color_ids"("colorId");

-- CreateIndex
CREATE INDEX "external_color_ids_source_idx" ON "external_color_ids"("source");

-- CreateIndex
CREATE UNIQUE INDEX "external_color_ids_source_externalId_key" ON "external_color_ids"("source", "externalId");

-- CreateIndex
CREATE INDEX "external_element_ids_elementId_idx" ON "external_element_ids"("elementId");

-- CreateIndex
CREATE INDEX "external_element_ids_source_idx" ON "external_element_ids"("source");

-- CreateIndex
CREATE UNIQUE INDEX "external_element_ids_source_externalId_key" ON "external_element_ids"("source", "externalId");

-- CreateIndex
CREATE INDEX "external_set_ids_setId_idx" ON "external_set_ids"("setId");

-- CreateIndex
CREATE INDEX "external_set_ids_source_idx" ON "external_set_ids"("source");

-- CreateIndex
CREATE UNIQUE INDEX "external_set_ids_source_externalId_key" ON "external_set_ids"("source", "externalId");

-- CreateIndex
CREATE INDEX "external_minifig_ids_minifigId_idx" ON "external_minifig_ids"("minifigId");

-- CreateIndex
CREATE INDEX "external_minifig_ids_source_idx" ON "external_minifig_ids"("source");

-- CreateIndex
CREATE UNIQUE INDEX "external_minifig_ids_source_externalId_key" ON "external_minifig_ids"("source", "externalId");

-- CreateIndex
CREATE INDEX "collection_sets_collectionId_idx" ON "collection_sets"("collectionId");

-- CreateIndex
CREATE INDEX "collection_sets_setId_idx" ON "collection_sets"("setId");

-- CreateIndex
CREATE INDEX "collection_sets_condition_idx" ON "collection_sets"("condition");

-- CreateIndex
CREATE INDEX "collection_sets_buildStatus_idx" ON "collection_sets"("buildStatus");

-- CreateIndex
CREATE INDEX "collection_parts_collectionId_idx" ON "collection_parts"("collectionId");

-- CreateIndex
CREATE INDEX "collection_parts_partId_idx" ON "collection_parts"("partId");

-- CreateIndex
CREATE INDEX "collection_parts_colorId_idx" ON "collection_parts"("colorId");

-- CreateIndex
CREATE UNIQUE INDEX "collection_parts_collectionId_partId_colorId_key" ON "collection_parts"("collectionId", "partId", "colorId");

-- CreateIndex
CREATE INDEX "collection_part_sources_collectionPartId_idx" ON "collection_part_sources"("collectionPartId");

-- CreateIndex
CREATE INDEX "collection_part_sources_sourceSetId_idx" ON "collection_part_sources"("sourceSetId");

-- CreateIndex
CREATE INDEX "storage_locations_collectionId_idx" ON "storage_locations"("collectionId");

-- CreateIndex
CREATE INDEX "storage_locations_parentId_idx" ON "storage_locations"("parentId");

-- CreateIndex
CREATE INDEX "element_storage_collectionPartId_idx" ON "element_storage"("collectionPartId");

-- CreateIndex
CREATE INDEX "element_storage_storageLocationId_idx" ON "element_storage"("storageLocationId");

-- CreateIndex
CREATE UNIQUE INDEX "element_storage_collectionPartId_storageLocationId_key" ON "element_storage"("collectionPartId", "storageLocationId");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "part_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elements" ADD CONSTRAINT "elements_partId_fkey" FOREIGN KEY ("partId") REFERENCES "parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elements" ADD CONSTRAINT "elements_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part_relationships" ADD CONSTRAINT "part_relationships_parentPartId_fkey" FOREIGN KEY ("parentPartId") REFERENCES "parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part_relationships" ADD CONSTRAINT "part_relationships_childPartId_fkey" FOREIGN KEY ("childPartId") REFERENCES "parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sets" ADD CONSTRAINT "sets_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_setId_fkey" FOREIGN KEY ("setId") REFERENCES "sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_parts" ADD CONSTRAINT "inventory_parts_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_parts" ADD CONSTRAINT "inventory_parts_partId_fkey" FOREIGN KEY ("partId") REFERENCES "parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_parts" ADD CONSTRAINT "inventory_parts_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_sets" ADD CONSTRAINT "inventory_sets_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_sets" ADD CONSTRAINT "inventory_sets_setId_fkey" FOREIGN KEY ("setId") REFERENCES "sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_minifigs" ADD CONSTRAINT "inventory_minifigs_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_minifigs" ADD CONSTRAINT "inventory_minifigs_minifigId_fkey" FOREIGN KEY ("minifigId") REFERENCES "minifigs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_part_ids" ADD CONSTRAINT "external_part_ids_partId_fkey" FOREIGN KEY ("partId") REFERENCES "parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_color_ids" ADD CONSTRAINT "external_color_ids_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_element_ids" ADD CONSTRAINT "external_element_ids_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "elements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_set_ids" ADD CONSTRAINT "external_set_ids_setId_fkey" FOREIGN KEY ("setId") REFERENCES "sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_minifig_ids" ADD CONSTRAINT "external_minifig_ids_minifigId_fkey" FOREIGN KEY ("minifigId") REFERENCES "minifigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_sets" ADD CONSTRAINT "collection_sets_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_sets" ADD CONSTRAINT "collection_sets_setId_fkey" FOREIGN KEY ("setId") REFERENCES "sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_parts" ADD CONSTRAINT "collection_parts_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_parts" ADD CONSTRAINT "collection_parts_partId_fkey" FOREIGN KEY ("partId") REFERENCES "parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_parts" ADD CONSTRAINT "collection_parts_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_part_sources" ADD CONSTRAINT "collection_part_sources_collectionPartId_fkey" FOREIGN KEY ("collectionPartId") REFERENCES "collection_parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_part_sources" ADD CONSTRAINT "collection_part_sources_sourceSetId_fkey" FOREIGN KEY ("sourceSetId") REFERENCES "sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage_locations" ADD CONSTRAINT "storage_locations_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage_locations" ADD CONSTRAINT "storage_locations_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "storage_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "element_storage" ADD CONSTRAINT "element_storage_collectionPartId_fkey" FOREIGN KEY ("collectionPartId") REFERENCES "collection_parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "element_storage" ADD CONSTRAINT "element_storage_storageLocationId_fkey" FOREIGN KEY ("storageLocationId") REFERENCES "storage_locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
