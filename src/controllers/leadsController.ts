import {Handler} from "express"
import { prisma } from "../database"
import { CreateLeadRequestSchema, GetLeadsRequestSchema, UpdateLeadRequestSchema } from "./schema/leadsRequestSchema"
import { HttpError } from "../errors/HttpError"
import { ILeadsRepository, WhereLeadsParams } from "../repositories/leadsRepository"
import { LeadSerivce } from "../services/LeadsService"

//agora o arquivo n depende mais do prisma pra funcionar

export class LeadsController {
    // private leadsRepository: ILeadsRepository

    // constructor(leadsRepository: ILeadsRepository) {
    //     this.leadsRepository = leadsRepository
    // }

    constructor(private readonly leadsService: LeadSerivce){}

    index: Handler = async (req, res, next) => {
        try{
            
            // const pageNumber = +page
            // const pageSizeNumber = +pageSize

            // const where: WhereLeadsParams = {} //faz uma variavel where com o tipo Prisma.LeadWhereInput
            
            // //coloca como case insensitiv-=e no mode
            // if(name) where.name = {like: name, mode: "insensitive"} //se nome existe ent atribui
            // if(status) where.status = status //se status existe ent atribui
            
            // // const leads = await prisma.lead.findMany({
            // //     where, 
            // //     skip: (pageNumber - 1) * pageSizeNumber,
            // //     take: pageSizeNumber,
            // //     orderBy: { [sortBy]: orderBy},
            // //     include:{
            // //         Group: true,
            // //         campaings: true
            // //     }
            // // })

            // const leads = await this.leadsRepository.find({where, sortBy, order: orderBy, limit: pageSizeNumber,
            //      offset: (pageNumber - 1) * pageSizeNumber}) //pega os leads

            // // const totalLeads = await prisma.lead.count({where,})

            // const total = await this.leadsRepository.count(where)

            const query = GetLeadsRequestSchema.parse(req.query); //pega os valores da query
            const { page = "1", pageSize = "5", status, name, sortBy  = "name", orderBy = "asc"} = query //  os com igual, é o valor padr~~ao caso n seja informado
            
            const result = await this.leadsService.getAllLeadsPaginated({
                name,
                status,
                page: +page,
                pageSize: +pageSize,
                sortBy,
                order: orderBy
            })

            res.json(result)
        }catch(error){
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try{
            //const newLead = await prisma.lead.create({data:body}) //cria um novo body
            
            //const newLead = await this.leadsRepository.createLeadAtributes(body) //cria um novo body
            
            const body = CreateLeadRequestSchema.parse(req.body)//converte o body pro schema

            const newLead = await this.leadsService.createLead(body) //cria um novo body

            res.status(201).json(newLead) //retorna o novo lead
        }catch(error){
            next(error)
        }
    }
    
    show: Handler = async (req, res, next) => {
        try{
            // const lead = await prisma.lead.findUnique({
            //     where: {id: parseInt(req.params.id)},
            //     include: {
            //         Group: true,
            //         campaings: true
            //     }
            // })

            // const lead = await this.leadsRepository.findById(+req.params.id) //pega a lead pelo id
            // if(!lead){
            //     throw new HttpError("Lead not found", 404) //se nao encontrar o lead
            // }

            const lead = await this.leadsService.getLeadById(+req.params.id) //pega a lead pelo id
            res.json(lead)
    }catch (error){
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try{
            const body = UpdateLeadRequestSchema.parse(req.body)

            // const lead = await this.leadsRepository.findById(+req.params.id) //pega a lead pelo id
            // if(!lead) throw new HttpError("Lead not found", 404)

            // //ve se o status selecionado foi diferente de contacted mesmo o lead sendo new
            // if(lead.status === "New" && body.status !== "Contacted" && body.status !== undefined){
            //     new HttpError("New lead must be contacted before changing its status", 404)
            // }    

            // if(body.status === "Archived" && body.status !== undefined){ //ve se o status selecionado for archieved
            //     const now = new Date() //cria uma nova datra de agora pra comparar
            //     const diffTime = Math.abs(now.getTime() - lead.updated_at.getTime())
            //     const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)) //calcula a diferença em dias

            //     if(diffDays < 180) throw new HttpError("Lead must be inactive for 180 days before being archived", 404)
            // }

            // // const updatedLead = await prisma.lead.update({
            // //     where: {id: parseInt(req.params.id)},
            // //     data: {name: body.name, status: body.status, phone: body.phone, email: body.email}
            // // })

            // const updatedLead = await this. leadsRepository.updateById(+req.params.id, body) //atualiza o lead pelo id

            const updatedLead =  await this.leadsService.updateLead(+req.params.id, body) //atualiza o lead pelo id

            res.json(updatedLead)
        }catch (error){
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try{
            // const leadExists = await this.leadsRepository.findById(+req.params.id)
            // if(!leadExists){
            //     throw new HttpError("Lead not found, try another id", 404)
            // }else{
            //     // const leadDeleted = await prisma.lead.delete({where: {id: parseInt(req.params.id)}})
            //     const leadDeleted = await this.leadsRepository.deleteById(+req.params.id)
                const leadDeleted = await this.leadsService.deleteLead(+req.params.id)
                res.json(leadDeleted).status(204)
            }catch(error){
            next(error)
        }
    }
}

