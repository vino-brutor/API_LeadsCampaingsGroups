import { Group } from "@prisma/client";

export interface CreateGroupAtributes{
    name: string
    description: string
}

export interface FindGroupParams {
    where?: WhereGroupParams
    sortBy?: "name" | "status" | "created_at"
    order?: "asc" | "desc"
    limit?: number
    offset?: number
}

export interface WhereGroupParams{
    id?: number
    name?: string
}


export interface IGroupsRepository {
    find: (params?: FindGroupParams) => Promise<Group[]>
    findById: (id:number) => Promise<Group | null>
    create: (atributes: CreateGroupAtributes) => Promise<Group>
    updateById: (id:number, atributes: Partial<CreateGroupAtributes>) => Promise<Group | null>
    deleteById: (id:number) => Promise<Group>
    addLead: (groupId:number, leadId:number) => Promise<Group>
    removeLead: (groupId:number, leadId:number) => Promise<Group>
    count: (where: WhereGroupParams) => Promise<number>
}