import { LeadStatus } from "@prisma/client";
import { z } from "zod";

export const CreateGrouprequestSchema = z.object({
    name: z.string(),
    description: z.string()
})

export const UpdateGroupRequestSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional()
})

export const GetGroupsLeadsSchema = z.object({
        page: z.string().optional(),
        pageSize: z.string().optional(),
        name: z.string().optional(),
        status: z.enum([
            "New",
            "Contacted",
            "Qualified",
            "Converted",
            "Unresponsive",
            "Disqualified",
            "Archived"
        ]).optional(),
        sortBy: z.enum(["name", "created_at"]).optional(),
        orderBy: z.enum(["asc", "desc"]).optional(),
})