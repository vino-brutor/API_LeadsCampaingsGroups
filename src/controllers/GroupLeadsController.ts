import { Handler } from "express";
import { GetCampaignLeadsSchema } from "./schema/campaignRequestSchema";
import { prisma } from "../database";
import { Prisma } from "@prisma/client";
import { GetGroupsLeadsSchema } from "./schema/groupsRequestSchema";

export class GroupLeadController {
    getLeadsInGroup: Handler = async (req, res, next) => {
        try{
            const groupId = +req.params.groupId

            const query = GetGroupsLeadsSchema.parse(req.query) //pega a query q é oq  agente via suar de filtro
            const {page = 1, pageSize = 5, name, status, sortBy = "name", orderBy = "asc"} = query
            
            const where: Prisma.GroupWhereInput = {
                id: groupId,
                name: name ? {contains: name} : undefined,
            }

            const leadsInGroup = await prisma.group.findUnique({
                where: { id: groupId },
                include: {
                  lead: {
                    where: {
                      name: name ? { contains: name, mode: "insensitive" } : undefined,
                      status: status || undefined
                    },
                    orderBy: {
                      [sortBy]: orderBy
                    },
                    skip: (Number(page) - 1) * Number(pageSize),
                    take: Number(pageSize),
                    select: {
                      name: true,
                      email: true,
                      status: true,
                      phone: true,
                    }
                  }
                }
              })

              res.status(200).json({
                message: "All group leads",
                data: leadsInGroup
              })

        }catch(error){
            next(error)
        }
    }

    addLeadInGroup: Handler = async (req, res, next) => {
        try{
            const groupId = +req.params.groupId
            const leadId = +req.params.leadId

            const group = await prisma.group.findUnique({where: {id: groupId}})
            const lead = await prisma.lead.findUnique({where: {id: leadId}})
            
            if(!group) res.json(404).json({message:"Group not found"})
            if(!lead) res.json(404).json({message:"Lead not found"})

            const leadInGroupAdded = await prisma.group.update({
                where: {id: groupId},
                data: {
                    lead: {
                        connect: {id: leadId} //connect serve pra conectar a linha de groups ao de lead
                    }
                }
            })

            res.status(200).json({
                message: "Lead was added to the group",
                data: leadInGroupAdded
              })

        }catch(error){
            next(error)
        }
    }

    //desvincula uma lead de um grupo
    removeLeadFromGroup: Handler = async (req, res, next) => {
        try{
            const groupId = +req.params.groupId
            const leadId = +req.params.leadId

            const group = await prisma.group.findUnique({where: {id: groupId}})
            const lead = await prisma.lead.findUnique({where: {id: leadId}})
            
            if(!group) res.json(404).json({message:"Group not found"})
            if(!lead) res.json(404).json({message:"Lead not found"})

            //nesse caso como é só desvincular, usa o update
            const removedLead = await prisma.group.update({
                where: {id: groupId},
                data: {
                    lead:{
                        disconnect: {id: leadId}
                    }
                }
            })   

            res.status(200).json({
                message: "Lead was removed from the group",
                data: removedLead
            })
        
        }catch(error){
            next(error)
        }
    }
}