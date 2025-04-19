import { Campaign } from "@prisma/client";
import { AddLeadCampaignAtributes, CreateCampaignAtributes, ICampaignRepository } from "../campaignsRepository";
import { prisma } from "../../database";

export class PrismaCampaignsRepository implements ICampaignRepository {
    find(): Promise<Campaign[]>{
        return prisma.campaign.findMany()
    }

    findById(id: number): Promise<Campaign | null>{
        return prisma.campaign.findUnique({
            where: {
                id,
            },
            include:{
                leads: {
                    include:{
                        lead: true
                }
            }
        }
        })
    }

    create(attributes: CreateCampaignAtributes): Promise<Campaign>{
        return prisma.campaign.create({data: attributes})
    }

    async updateById(id: number, attributes: Partial<CreateCampaignAtributes>): Promise<Campaign | null>{
        const campaignExists = await prisma.campaign.findUnique({
            where: {
            id,
            }
        })

        if(!campaignExists) return null

        return prisma.campaign.update({
            where: {
                id,
            },
            data: attributes
        })
    }

    async deleteById(id: number): Promise<Campaign | null>{
        const campaignExists = await prisma.campaign.findUnique({
            where: {
            id,
            }
        })

        if(!campaignExists) return null

        return prisma.campaign.delete({
            where:{
                id,
            }
        })
    }

    async addLead (attributes: AddLeadCampaignAtributes): Promise<void>{
        await prisma.leadCampaign.create({
            data: attributes
        })
    }

    async updateLeadStatus(attributes: AddLeadCampaignAtributes): Promise<void>{

        const updatedLeadCampaign = await prisma.leadCampaign.update({
            data: {status: attributes.status},
            where: {
                leadId_campaingId: {
                    campaingId: attributes.campaingId,
                    leadId: attributes.leadId
                }
            }
        })
    }

    async removeLead(campaignId: number, leadId: number): Promise<void>{
        const removedLead = await prisma.leadCampaign.delete({
            where: {
                leadId_campaingId: {
                    campaingId: campaignId,
                    leadId: leadId
                }
            }
        }) 
    }
}