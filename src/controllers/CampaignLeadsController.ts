import { Handler } from "express"
import { GetLeadsRequestSchema } from "./schema/leadsRequestSchema"
import { Prisma } from "@prisma/client"
import { AddLeadRequestSchema, GetCampaignLeadsSchema, UpdateLeadStatusRequestSchema } from "./schema/campaignRequestSchema"
import { prisma } from "../database"

export class CampaignLeadsController {

    //pegar todos os leads de uma campanha
    getLeads: Handler = async (req, res, next) => {
        try{
            const campaingId = +req.params.campaignId 
            const query = GetCampaignLeadsSchema.parse(req.query) //pega a query q é oq  agente via suar de filtro
            const {page = 1, pageSize = 5, name, status, sortBy = "name", orderBy = "asc"} = query

            const pageNumber = +page
            const pageSizeNumber = +pageSize

            const where : Prisma.LeadWhereInput = { //filtro pro leads
                campaings: {
                    some: {campaingId} //mostra as camapnhas q forem igual ao campaignId
                }
            }

            if(name) where.name = {contains: name, mode: "insensitive"}
            if(status) where.campaings = {some: {status: status}}

            const leads = await prisma.lead.findMany({
                where,
                orderBy: {[sortBy]: orderBy},
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                include: {
                    campaings: {
                        select:{
                            campaingId: true,
                            leadId: true,
                            status: true
                        }
                    }
                }
            })

            const total = await prisma.lead.count({where})

            res.json({
                leads, 
                meta: {
                    page: pageNumber,
                    pageSize: pageSizeNumber,
                    total,
                    totalPages: Math.ceil(total / pageSizeNumber)
                }
            })
        }catch(error){
            next(error)
        }
    }

    addLeads: Handler = async (req, res, next) => {
        try{
            const body = AddLeadRequestSchema.parse(req.body)
            await prisma.leadCampaign.create({
                data: {
                    campaingId: +(req.params.campaignId),
                    leadId: +body.leadId,
                    status: body.status
                }
            })

            res.status(200).end()

        }catch(error){
            next(error)
        }
    }
    updateLeadStatus: Handler = async (req, res, next) => {
        try{
            const body = UpdateLeadStatusRequestSchema.parse(req.body)

            const updatedLeadCampaign = await prisma.leadCampaign.update({
                data: body,
                where: {
                    leadId_campaingId: {
                        campaingId: +req.params.campaignId,
                        leadId: +req.params.leadId
                    }
                }
            })

            res.status(200).json(updatedLeadCampaign)
        }catch(error){
            next(error)
        }
    }

    removeLead: Handler = async (req, res, next) => {
        try{
            const removedLead = await prisma.leadCampaign.delete({
                where: {
                    leadId_campaingId: {
                        campaingId: +req.params.campaignId,
                        leadId: +req.params.leadId
                    }
                }
            }) 

            res.json(removedLead)
        }catch(error){
            next(error)
        }
    }
}