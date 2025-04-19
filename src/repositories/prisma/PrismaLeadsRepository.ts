import { Lead, Prisma } from "@prisma/client";
import { CreateLeadAtributes, FindLeadsParams, ILeadsRepository, WhereLeadsParams } from "../leadsRepository";
import { prisma } from "../../database";

export class PrismaLeadsRepository implements ILeadsRepository {
    async find(params: FindLeadsParams): Promise<Lead[]>{
        let where: Prisma.LeadWhereInput = {
            name: {
                contains: params.where?.name?.like,
                equals: params.where?.name?.equals,
                mode: params.where?.name?.mode
            },
            status: params.where?.status
        }
        
        if(params.where?.groupId){
            where.Group = {some: {id: params.where?.groupId}}
        }

        if(params.where?.campaignId){
            where.campaings = {some: {campaingId: params.where?.campaignId}}
        }

        return prisma.lead.findMany({
            where,
            orderBy: {[params.sortBy ?? "name"]: params.order},
            skip: params.offset,
            take: params.limit,
            include: {
                Group: params.include?.Group,
                campaings: params.include?.campaings
            }
        })
    }
    async findById(id: number): Promise<Lead | null>{
        
        return prisma.lead.findUnique({
            where: {id},
            include: {
                campaings: true,
                Group: true
            }
        })
    }

    async count(where: WhereLeadsParams): Promise<number>{
        let prismaWhere: Prisma.LeadWhereInput = {
            name: {
                contains: where?.name?.like,
                equals: where?.name?.equals,
                mode: where?.name?.mode
            },
            status: where?.status
        }
        
        if(where?.groupId){
            prismaWhere.Group = {some: {id: where?.groupId}}
        }

        if(where?.campaignId){
            prismaWhere.campaings = {some: {campaingId: where?.campaignId}}
        }

        return prisma.lead.count({
            where: prismaWhere,
        })
    }
    async createLeadAtributes(atributtes: CreateLeadAtributes): Promise<Lead>{
        
        return prisma.lead.create({
            data: atributtes
        })
    }
    async updateById(id:number, atributtes: Partial<CreateLeadAtributes>): Promise<Lead>{
        
        return prisma.lead.update({where: {id}, data: atributtes})
    }
    async deleteById(id:number): Promise<Lead>{

        return prisma.lead.delete({where: {id}})
    }
}