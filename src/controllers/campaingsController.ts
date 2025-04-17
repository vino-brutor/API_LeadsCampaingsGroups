import { Handler } from "express";
import { prisma } from "../database";
import { CreateCampaignRequestSchema, UpdateCampaignRequestSchema } from "./schema/campaignRequestSchema";
import { HttpError } from "../errors/HttpError";

export class CampaingController {
    index: Handler = async (req, res, next) => {
        try{
            const campaings = await prisma.campaign.findMany()
             res.status(200).json(campaings)
        }catch(error){
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try{

            const body = CreateCampaignRequestSchema.parse(req.body)
            const newCampaing = await prisma.campaign.create({
                data: body
            })

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

            const capampaignUnique = await prisma.campaign.findUnique({
                where: {id: +req.params.id},
                include: {
                    leads:{
                        include: {
                            lead: true
                        }
                    }
                }
            })

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

            const capampaignUnique = await prisma.campaign.findUnique({
                where: {id: +req.params.id}
            })

            if(!capampaignUnique) throw new HttpError("Campaign not found", 404)

            const updatedCampaign = await prisma.campaign.update({
                where: {id: +req.params.id},
                data: body
            })

            res.status(200).json(updatedCampaign)
        }catch(error){
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try{
            
            if(isNaN(+req.params.id)) throw new HttpError("Id must be a number", 404 )

            const body = CreateCampaignRequestSchema.parse(req.body)
    
            const capampaignUnique = await prisma.campaign.findUnique({
                where: {id: +req.params.id}
            })
    
            if(!capampaignUnique) throw new HttpError("Campaign not found", 404)
            const deletedCampaign = await prisma.campaign.delete({
                where: {id: +req.params.id}
            })
            res.status(200).json(deletedCampaign)
        }catch(error){
            next(error)
        }
    }
}