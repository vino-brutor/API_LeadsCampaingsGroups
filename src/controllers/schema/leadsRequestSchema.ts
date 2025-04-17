import { z } from "zod"

const leadStatusEnum =  z.enum([
    "New",
    "Contacted",
    "Qualified",
    "Converted",
    "Unresponsive",
    "Disqualified",
    "Archived"
]).optional()

export const CreateLeadRequestSchema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    phone: z.string().min(8).max(15),
    status: leadStatusEnum
})

export const UpdateLeadRequestSchema = z.object({
    name: z.string().min(3).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(8).max(15).optional(),
    status: z.enum([ 
        "New",
        "Contacted",
        "Qualified",
        "Converted",
        "Unresponsive",
        "Disqualified",
        "Archived"
    ]).optional()
})

export const GetLeadsRequestSchema = z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    name: z.string().optional(),
    status: leadStatusEnum.optional(),
    sortBy: z.enum(["name", "status", "created_at"]).optional(),
    orderBy: z.enum(["asc", "desc"]).optional(),
})