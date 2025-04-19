import { Lead } from "@prisma/client";
import { LeadCampaignStatus } from "./campaignsRepository";

//nosso tipo de Status
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted" | "Unresponsive" | "Disqualified" | "Archived"

//nossos parametros de where usados na interface findleadsParams
export interface WhereLeadsParams {
    name?: {
        like?: string
        equals?: string
        mode?: "default" | "insensitive"
    }
    status?: LeadStatus
    groupId?: number
    campaignId?: number
    campaignStatus?: LeadCampaignStatus
}


//interface pra criar uma lead, é usada ali no ILeadesRepository na funcao find
export interface FindLeadsParams {
    where?: WhereLeadsParams
    sortBy?: "name" | "status" | "created_at"
    order?: "asc" | "desc"
    limit?: number
    offset?: number
    include?: {
        Group?: boolean
        campaings?: boolean
    }
}

export interface CreateLeadAtributes {
    name: string
    email: string
    phone: string
    status?: LeadStatus
}

//cria a interface com o q queremos fazer no nosso repositorio
export interface ILeadsRepository {
    find: (params: FindLeadsParams) => Promise<Lead[]>
    findById: (id: number) => Promise<Lead | null>
    createLeadAtributes: (attributes: CreateLeadAtributes) => Promise<Lead>
    count: (where: WhereLeadsParams) => Promise<number>
    //partial serve pra tornar todas os atributos opcionais
    updateById: (id: number, attributes: Partial<CreateLeadAtributes>) => Promise<Lead | null>
    deleteById: (id:number) => Promise<Lead | null>
}