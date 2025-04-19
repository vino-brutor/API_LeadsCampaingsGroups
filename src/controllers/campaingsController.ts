import { Handler } from "express";
import { CreateCampaignRequestSchema, UpdateCampaignRequestSchema } from "./schema/campaignRequestSchema";
import { HttpError } from "../errors/HttpError";
import { ICampaignRepository } from "../repositories/campaignsRepository";

export class CampaingController {
    private campaignRepository: ICampaignRepository

    constructor(campaignRepository: ICampaignRepository){
        this.campaignRepository = campaignRepository
    }

    index: Handler = async (req, res, next) => {
        try{
            // const campaings = await prisma.campaign.findMany()
            const campaings = await this.campaignRepository.find()
             
            res.status(200).json(campaings)
        }catch(error){
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try{

            const body = CreateCampaignRequestSchema.parse(req.body)
            // const newCampaing = await prisma.campaign.create({
            //     data: body
            // })

            const newCampaing = await this.campaignRepository.create(body)

            if(newCampaing){
                res.status(201).json(newCampaing)
            }else{
                res.status(400).json({message: "Error creating campaign"})

            }
        }catch(error){
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try{

            if(isNaN(+req.params.id)) throw new HttpError("Id must be a number", 400)


            const capampaignUnique = await this.campaignRepository.findById(+req.params.Id)    
            // const capampaignUnique = await prisma.campaign.findUnique({
            //     where: {id: +req.params.id},
            //     include: {
            //         leads:{
            //             include: {
            //                 lead: true
            //             }
            //         }
            //     }
            // })

            if(!capampaignUnique) throw new HttpError("Campaign not found", 404 )

            res.status(200).json(capampaignUnique)
        }catch(error){
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try{
            if(isNaN(+req.params.id)) throw new HttpError("Id must be a number", 404 )
            const body = UpdateCampaignRequestSchema.parse(req.body)

            // const updatedCampaign = await prisma.campaign.update({
            //     where: {id: +req.params.id},
            //     data: body
            // })

             const updatedCampaign = await this.campaignRepository.updateById(+req.params.id, body)

            if(!updatedCampaign) throw new HttpError("Campaign not found", 404)


            res.status(200).json(updatedCampaign)
        }catch(error){
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try{
            
            if(isNaN(+req.params.id)) throw new HttpError("Id must be a number", 404 )

            const body = CreateCampaignRequestSchema.parse(req.body)
    
            // const deletedCampaign = await prisma.campaign.delete({
            //     where: {id: +req.params.id}
            // })
    
            const deletedCampaign = await this.campaignRepository.deleteById(+req.params.id)

            if(!deletedCampaign) throw new HttpError("Campaign not found", 404)
            res.status(200).json(deletedCampaign)
        }catch(error){
            next(error)
        }
    }
}