
import { LeadsController } from "./controllers/leadsController"
import { errorHandlerMiddleware } from "./middlewares/errorHandler"
import { GroupsController } from "./controllers/GroupsController"
import { CampaingController } from "./controllers/campaingsController"
import { CampaignLeadsController } from "./controllers/CampaignLeadsController"
import { GroupLeadController } from "./controllers/GroupLeadsController"
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository"
import { PrismaGroupRepository } from "./repositories/prisma/PrismaGroupRepository"
import { PrismaCampaignsRepository } from "./repositories/prisma/PrismaCampaignsRepository"
import { LeadSerivce } from "./services/LeadsService"

const leadsRepository = new PrismaLeadsRepository()
const groupRepository = new PrismaGroupRepository()
const campaignsRepositor = new PrismaCampaignsRepository()

const leadService = new LeadSerivce(leadsRepository)

export const leadsController = new LeadsController(leadService)
export const groupsController = new GroupsController(groupRepository)
export const campaignController = new CampaingController(campaignsRepositor)
export const campaignLeadsController = new CampaignLeadsController(campaignsRepositor, leadsRepository)
export const groupLeadsController = new GroupLeadController(groupRepository, leadsRepository)
