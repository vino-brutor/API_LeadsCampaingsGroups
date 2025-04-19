import { Handler } from "express";
import { GetGroupsLeadsSchema } from "./schema/groupsRequestSchema";
import { IGroupsRepository, WhereGroupParams } from "../repositories/groupRepository";
import { ILeadsRepository } from "../repositories/leadsRepository";

export class GroupLeadController {

    constructor(private readonly groupsRepository: IGroupsRepository, 
        private readonly leadsRepository: ILeadsRepository) {}

    getLeadsInGroup: Handler = async (req, res, next) => {
        try{
            const groupId = +req.params.groupId

            const query = GetGroupsLeadsSchema.parse(req.query) //pega a query q é oq  agente via suar de filtro
            const {page = 1, pageSize = 5, name, status, sortBy = "name", orderBy = "asc"} = query
            
            const offset = (Number(page) - 1) * Number(pageSize)
            const limit = +page

            const where: WhereGroupParams = {
                id: groupId,
                name,
            }

            const leadsInGroup = await this.groupsRepository.find({where, sortBy, order: orderBy, limit: limit,
                offset: offset})

            const total = await this.groupsRepository.count(where)

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

            const group = await this.groupsRepository.findById(groupId)
            const lead = await this.leadsRepository.findById(leadId)
            
            if(!group) res.json(404).json({message:"Group not found"})
            if(!lead) res.json(404).json({message:"Lead not found"})

            // const leadInGroupAdded = await prisma.group.update({
            //     where: {id: groupId},
            //     data: {
            //         lead: {
            //             connect: {id: leadId} //connect serve pra conectar a linha de groups ao de lead
            //         }
            //     }
            // })

            const leadInGroupAdded = await this.groupsRepository.addLead(groupId, leadId)

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

            const group = await this.groupsRepository.findById(groupId)
            const lead = await  this.leadsRepository.findById(leadId)
            
            if(!group) res.json(404).json({message:"Group not found"})
            if(!lead) res.json(404).json({message:"Lead not found"})

            //nesse caso como é só desvincular, usa o update
            // const removedLead = await prisma.group.update({
            //     where: {id: groupId},
            //     data: {
            //         lead:{
            //             disconnect: {id: leadId}
            //         }
            //     }
            // })   

            const removedLead = await this.groupsRepository.removeLead(groupId, leadId)


            res.status(200).json({
                message: "Lead was removed from the group",
                data: removedLead
            })
        
        }catch(error){
            next(error)
        }
    }
}