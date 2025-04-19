import { Campaign } from "@prisma/client";

export type LeadCampaignStatus =   "New" | "Engaged" | "FollowUp_Scheduled" | "Contacted" | "Converted" | "Unresponsive" | "Disqualified" | "Re_Engaged" | "Opted_Out"

export interface CreateCampaignAtributes{
    name: string
    description: string
    startDate: Date
    endDate?: Date
}

export interface AddLeadCampaignAtributes{
    campaingId: number
    leadId: number
    status: LeadCampaignStatus
}

export interface ICampaignRepository{
    find: () => Promise<Campaign[]>
    findById: (id: number) => Promise<Campaign | null>
    create: (attributes: CreateCampaignAtributes) => Promise<Campaign>
    updateById: (id:number, attributes: Partial<CreateCampaignAtributes>) => Promise<Campaign | null>
    deleteById: (id: number) => Promise<Campaign | null>
    addLead: (attributes: AddLeadCampaignAtributes) => Promise<void>
    updateLeadStatus: (attributes: AddLeadCampaignAtributes) => Promise<void>
    removeLead: (campaignId: number, leadId: number) => Promise<void>
}