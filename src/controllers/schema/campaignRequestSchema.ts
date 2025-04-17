import { describe } from "node:test";
import { z } from "zod";

export const CreateCampaignRequestSchema = z.object({
    name: z.string().min(1),
    description:  z.string().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    /*
        como só da pra passar string pelo corpo json. a gnte usa o coerce pra coverter pra data
    */
})

export const UpdateCampaignRequestSchema = z.object({
    name: z.string().min(1).optional(),
    description:  z.string().min(1).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional().optional(),
})

const LeadCampaignStatusEnum =  z.enum([
    "New",
    "Engaged",
    "FollowUp_Scheduled",
    "Contacted",
    "Converted",
    "Unresponsive",
    "Disqualified",
    "Re_Engaged",
    "Opted_Out"
]).optional()

export const GetCampaignLeadsSchema = z.object({
        page: z.string().optional(),
        pageSize: z.string().optional(),
        name: z.string().optional(),
        status: LeadCampaignStatusEnum.optional(),
        sortBy: z.enum(["name", "created_at"]).optional(),
        orderBy: z.enum(["asc", "desc"]).optional(),
})

export const AddLeadRequestSchema = z.object({
    leadId: z.number(),
    status: LeadCampaignStatusEnum.optional(),
})

export const UpdateLeadStatusRequestSchema = z.object({
    status: LeadCampaignStatusEnum
})