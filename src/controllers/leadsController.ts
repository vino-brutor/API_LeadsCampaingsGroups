import {Handler} from "express"
import { prisma } from "../database"
import { CreateLeadRequestSchema, GetLeadsRequestSchema, UpdateLeadRequestSchema } from "./schema/leadsRequestSchema"
import { HttpError } from "../errors/HttpError"
import { Prisma } from "@prisma/client"

export class LeadsController {
    index: Handler = async (req, res, next) => {
        try{
            const query = GetLeadsRequestSchema.parse(req.query); //pega os valores da query
            const { page = "1", pageSize = "5", status, name, sortBy  = "name", orderBy = "asc"} = query //  os com igual, é o valor padr~~ao caso n seja informado
            
            const pageNumber = +page
            const pageSizeNumber = +pageSize
            
            const where: Prisma.LeadWhereInput = {} //faz uma variavel where com o tipo Prisma.LeadWhereInput
            
            //coloca como case insensitive no mode
            if(name) where.name = {contains: name, mode: "insensitive"} //se nome existe ent atribui
            if(status) where.status = status //se status existe ent atribui
            
            const leads = await prisma.lead.findMany({
                where, 
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                orderBy: { [sortBy]: orderBy},
                include:{
                    Group: true,
                    campaings: true
                }
            })

            const totalLeads = await prisma.lead.count({where,})

            res.json({data: leads, pagination: {page: pageNumber, pageSize: pageSizeNumber, totalPages: Math.ceil(totalLeads / pageSizeNumber)}})
        }catch(error){
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try{
            const body = CreateLeadRequestSchema.parse(req.body)//converte o body pro schema
            const newLead = await prisma.lead.create({data:body}) //cria um novo body

            res.status(201).json(newLead) //retorna o novo lead
        }catch(error){
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try{
            const lead = await prisma.lead.findUnique({
                where: {id: parseInt(req.params.id)},
                include: {
                    Group: true,
                    campaings: true
                }
            })

            if(lead){
                res.json(lead)
            }else{
                throw new HttpError("Lead not found, try another id", 404)
            }
        }catch (error){
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try{
            const body = UpdateLeadRequestSchema.parse(req.body)
            const updatedLead = await prisma.lead.update({
                where: {id: parseInt(req.params.id)},
                data: {name: body.name, status: body.status, phone: body.phone, email: body.email}
            })

            res.json(updatedLead)
        }catch (error){
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try{
            const leadExists = await prisma.lead.findUnique({where: {id: +req.params.id}})
            if(!leadExists){
                throw new HttpError("Lead not found, try another id", 404)
            }else{
                const leadDeleted = await prisma.lead.delete({where: {id: parseInt(req.params.id)}})
                res.json(leadDeleted).status(204)
            }

        }catch(error){
            next(error)
        }
    }
}

