import { HttpError } from "../errors/HttpError"
import { IGroupsRepository } from "../repositories/groupRepository"
import { CreateGrouprequestSchema, UpdateGroupRequestSchema } from "./schema/groupsRequestSchema"
import {Handler} from "express"

export class GroupsController {

    private groupRepository: IGroupsRepository

    constructor(groupRepository: IGroupsRepository){
        this.groupRepository = groupRepository
    }

    index: Handler = async (req, res, next) => {
        try{
            const groups = await this.groupRepository.find()
            res.json(groups)
            
            
        }catch (error){
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try{
            const body = CreateGrouprequestSchema.parse(req.body)
            const newGroup = await this.groupRepository.create(body)

            res.status(201).json(newGroup)
        }catch (error){
            next(error)
        }
    }
    show: Handler = async (req, res, next) => {
        try{
            if(isNaN(+req.params.id)) throw new HttpError("Invalid Id", 400) 

            const groupSearched = await this.groupRepository.findById(+req.params.id)

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
            const body = UpdateGroupRequestSchema.parse(req.body)
            
            const updatedGroup = await this.groupRepository.updateById(+req.params.id, body)
            
            if(!updatedGroup){
                throw new HttpError("Group not found", 404)
            }

            // const updatedGroup = await prisma.group.update({
            //     data: {name: body.name, description: body.description, updated_at: new Date()},
            //     where: {id: +req.params.id}
                
            // })


            res.status(200).json(updatedGroup)
        }catch (error){
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try{
            //const groupExists = await this.groupRepository.findById(+req.params.id)
            const deletedGroup = await this.groupRepository.deleteById(+req.params.id)
            
            if(!deletedGroup){
                throw new HttpError("Group not found", 404)
            }
            // const deletedGroup = await prisma.group.delete({
            //     where: {id: +req.params.id}
            // })


            res.status(200).json(deletedGroup)
        }catch (error){
            next(error)
        }
    }

}