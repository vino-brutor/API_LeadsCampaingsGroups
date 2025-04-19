import { Group } from "@prisma/client";
import { CreateGroupAtributes, IGroupsRepository, WhereGroupParams } from "../groupRepository";
import { prisma } from "../../database";

export class PrismaGroupRepository implements IGroupsRepository{
    
    count(where: WhereGroupParams): Promise<number>{
        return prisma.group.count({where: where})
    }

    findMany(where: WhereGroupParams): Promise<Group[]>{
        return prisma.group.findMany({where: where, include: {lead: true}})
    }

    find(): Promise<Group[]> {
        return prisma.group.findMany()
    }


    findById(id: number): Promise<Group| null>{
        return prisma.group.findUnique({where: {id}})
    }

    create(atributes: CreateGroupAtributes): Promise<Group>{
        return prisma.group.create({data: atributes})
    }

    updateById(id: number, atributes: Partial<CreateGroupAtributes>): Promise<Group | null>{
        return prisma.group.update({where: {id}, data: atributes})
    }

    deleteById(id: number): Promise<Group>{
        return prisma.group.delete({where: {id}})
    }
    
    addLead(groupId: number, leadId: number): Promise<Group>{
        return prisma.group.update({
            where: {id: groupId},
            data: {
                lead: {
                    connect: {id: leadId} //connect serve pra conectar a linha de groups ao de lead
                }
            },
            include: {
                lead: true
            }
        })
    }

    removeLead(groupId: number, leadId: number): Promise<Group>{
        return prisma.group.update({
            where: {id: groupId},
            data: {
                lead:{
                    disconnect: {id: leadId}
                }
            },
            include: {
                lead: true
            }
        })   
    }

    

}