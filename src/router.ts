import {Router} from "express"
import { HttpError } from "./errors/HttpError"
import { campaignController, campaignLeadsController, groupLeadsController, groupsController, leadsController } from "./container"


const router = Router()

//rotas leads com o controler de erro
router.get("/leads", leadsController.index)
router.post("/leads", leadsController.create)
router.get("/leads/:id", leadsController.show)
router.put("/leads/:id", leadsController.update)
router.delete("/leads/:id", leadsController.delete)

//rotas de grupo
router.get("/groups", groupsController.index)
router.post("/groups", groupsController.create)
router.get("/posts/:id", groupsController.show)
router.put("/groups/:id", groupsController.update)
router.delete("/groups/:id", groupsController.delete)

//rotas de campanhas
router.get("/campaigns", campaignController.index)
router.post("/campaigns",campaignController.create)
router.get("/campaigns/:id",campaignController.show)
router.put("/campaigns/:id",campaignController.update)
router.delete("/campaigns/:id",campaignController.delete)

//rotas de leads em campanhas
router.get("campaigns/:campaignId/leads", campaignLeadsController.getLeads)
router.post("/campaigns/:campaignId/leads", campaignLeadsController.addLeads)
router.put("/campaigns/:campaignId/leads/:leadId", campaignLeadsController.updateLeadStatus)
router.put("/campaigns/:campaignId/leads/:leadId", campaignLeadsController.removeLead)

//rota de leads em grupos
router.get("/groups/:groupId/leads", groupLeadsController.getLeadsInGroup)
router.post("/groups/:groupId/leads", groupLeadsController.addLeadInGroup)
router.delete("/group/:groupId/leads/:leadId", groupLeadsController.removeLeadFromGroup)


//rota teste
router.get("/test", async (req, res, next) => {
    try{
        //throw new HttpError("Not authorized", 401)
        res.json({message:"sucsses"}) 
    }catch(error){
        next(error)
    }
})


export {router}