-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('New', 'Contacted', 'Qualified', 'Converted', 'Unresponsive', 'Disqualified', 'Archived');

-- CreateEnum
CREATE TYPE "LeadCampaingStatus" AS ENUM ('New', 'Engaged', 'FollowUp_Scheduled', 'Contacted', 'Converted', 'Unresponsive', 'Disqualified', 'Re_Engaged', 'Opted_Out');

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'New',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadCampaign" (
    "leadId" INTEGER NOT NULL,
    "campaingId" INTEGER NOT NULL,
    "status" "LeadCampaingStatus" NOT NULL DEFAULT 'New',

    CONSTRAINT "LeadCampaign_pkey" PRIMARY KEY ("leadId","campaingId")
);

-- CreateTable
CREATE TABLE "_GroupLeads" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GroupLeads_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_phone_key" ON "Lead"("phone");

-- CreateIndex
CREATE INDEX "_GroupLeads_B_index" ON "_GroupLeads"("B");

-- AddForeignKey
ALTER TABLE "LeadCampaign" ADD CONSTRAINT "LeadCampaign_campaingId_fkey" FOREIGN KEY ("campaingId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadCampaign" ADD CONSTRAINT "LeadCampaign_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupLeads" ADD CONSTRAINT "_GroupLeads_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupLeads" ADD CONSTRAINT "_GroupLeads_B_fkey" FOREIGN KEY ("B") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
