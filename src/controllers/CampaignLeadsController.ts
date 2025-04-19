import { Handler } from "express"
import { AddLeadRequestSchema, GetCampaignLeadsSchema, UpdateLeadStatusRequestSchema } from "./schema/campaignRequestSchema"
import { ICampaignRepository } from "../repositories/campaignsRepository"
import { ILeadsRepository, WhereLeadsParams } from "../repositories/leadsRepository"

export class CampaignLeadsController {

    private campaignRepository: ICampaignRepository
    private leadRepository: ILeadsRepository
    constructor(campaignRepository: ICampaignRepository, leadRepository: ILeadsRepository) {
        this.campaignRepository = campaignRepository
        this.leadRepository = leadRepository
    }

    //pegar todos os leads de uma campanha
    getLeads: Handler = async (req, res, next) => {
        try{
            const campaingId = +req.params.campaignId 
            const query = GetCampaignLeadsSchema.parse(req.query) //pega a query q é oq  agente via suar de filtro
            const {page = 1, pageSize = 5, name, status, sortBy = "name", orderBy = "asc"} = query

            const limit = +pageSize
            const offset = (Number(page) - 1) * limit

            // const where : Prisma.LeadWhereInput = { //filtro pro leads
            //     campaings: {
            //         some: {campaingId} //mostra as camapnhas q forem igual ao campaignId
            //     }
            // }

            const where: WhereLeadsParams = {
                campaignId: campaingId,
                campaignStatus: status
            }

            if(name) where.name = {like: name, mode: "insensitive"}

            // const leads = await prisma.lead.findMany({
            //     where,
            //     orderBy: {[sortBy]: orderBy},
            //     skip: (pageNumber - 1) * pageSizeNumber,
            //     take: pageSizeNumber,
            //     include: {
            //         campaings: true
            //     }
            // })

            const leads = await this.leadRepository.find({where, 
                offset,
                limit,
                order:orderBy,
                sortBy, 
                include: {campaings: true}
            })

            //const total = await prisma.lead.count({where})

            const total = await this.leadRepository.count(where) //conta a quantidade de leads


            res.json({
                leads, 
                meta: {
                    page: +page,
                    pageSize: limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            })
        }catch(error){
            next(error)
        }
    }

    addLeads: Handler = async (req, res, next) => {
        try{
            const campaingId = +req.params.campaignId
            const {leadId, status = "New"} = AddLeadRequestSchema.parse(req.body)
            // await prisma.leadCampaign.create({
            //     data: {
            //         campaingId: +(req.params.campaignId),
            //         leadId: +body.leadId,
            //         status: body.status
            //     }
            // })

            await this.campaignRepository.addLead({campaingId, leadId, status})

            res.status(200).end()

        }catch(error){
            next(error)
        }
    }
    updateLeadStatus: Handler = async (req, res, next) => {
        try{
            const {status = "New"} = UpdateLeadStatusRequestSchema.parse(req.body)

            // const updatedLeadCampaign = await prisma.leadCampaign.update({
            //     data: body,
            //     where: {
            //         leadId_campaingId: {
            //             campaingId: +req.params.campaignId,
            //             leadId: +req.params.leadId
            //         }
            //     }
            // })

            await this.campaignRepository.updateLeadStatus({campaingId: +req.params.campaignId, leadId: +req.params.leadId, status: status})

            res.status(204).json({message: "Lead updated successfully"})
        }catch(error){
            next(error)
        }
    }

    removeLead: Handler = async (req, res, next) => {
        try{
            // const removedLead = await prisma.leadCampaign.delete({
            //     where: {
            //         leadId_campaingId: {
            //             campaingId: +req.params.campaignId,
            //             leadId: +req.params.leadId
            //         }
            //     }
            // }) 
            const campaignId = +req.params.campaignId
            const leadId = +req.params.leadId

            await this.campaignRepository.removeLead(campaignId, leadId)

            res.status(204).json({message: "Lead removed successfully"})
        }catch(error){
            next(error)
        }
    }
}