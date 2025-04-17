import { prisma } from "../database"
import { HttpError } from "../errors/HttpError"
import { CreateGrouprequestSchema, UpdateGroupRequestSchema } from "./schema/groupsRequestSchema"
import {Handler} from "express"

export class GroupsController {
    index: Handler = async (req, res, next) => {
        try{
            const groups = await prisma.group.findMany()
            res.json(groups)
            
            
        }catch (error){
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try{
            const body = CreateGrouprequestSchema.parse(req.body)
            const newGroup = await prisma.group.create({
                data: body
            })

            res.status(201).json(newGroup)
        }catch (error){
            next(error)
        }
    }
    show: Handler = async (req, res, next) => {
        try{
            if(isNaN(+req.params.id)) throw new HttpError("Invalid Id", 400) 

            const groupSearched = await prisma.group.findUnique({
                where: {id: +req.params.id},
                include: {lead: true}
            })

            if(!groupSearched){
                throw new HttpError("Group not found", 404)
            }else{
                res.status(200).json(groupSearched)
            }

        }catch (error){
            next(error)
        }
    }
    update: Handler = async (req, res, next) => {
        try{
            const groupExists = await prisma.group.findUnique({where: {id: +req.params.id}})
            if(!groupExists){
                throw new HttpError("Group not found", 404)
            }
            const body = UpdateGroupRequestSchema.parse(req.body)

            const updatedGroup = await prisma.group.update({
                data: {name: body.name, description: body.description, updated_at: new Date()},
                where: {id: +req.params.id}
                
            })
            res.status(200).json(updatedGroup)
        }catch (error){
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try{
            const groupExists = await prisma.group.findUnique({where: {id: +req.params.id}})
            if(!groupExists){
                throw new HttpError("Group not found", 404)
            }
            const deletedGroup = await prisma.group.delete({
                where: {id: +req.params.id}
            })

            res.status(200).json(deletedGroup)
        }catch (error){
            next(error)
        }
    }

}