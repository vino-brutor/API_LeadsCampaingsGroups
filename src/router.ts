import {Router} from "express"
import { HttpError } from "./errors/HttpError"
import { LeadsController } from "./controllers/leadsController"
import { errorHandlerMiddleware } from "./middlewares/errorHandler"
import { GroupsController } from "./controllers/GroupsController"
import { CampaingController } from "./controllers/campaingsController"
import { CampaignLeadsController } from "./controllers/CampaignLeadsController"
import { GroupLeadController } from "./controllers/GroupLeadsController"

const router = Router()

const leadsController = new LeadsController()
const groupsController = new GroupsController()
const campaignController = new CampaingController()
const campaignLeadsController = new CampaignLeadsController()
const groupLeadsController = new GroupLeadController()

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

router.get("campaigns/:campaignId/leads", campaignLeadsController.getLeads)
router.post("/campaigns/:campaignId/leads")
router.put("/campaigns/:campaignId/leads/:leadId")

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