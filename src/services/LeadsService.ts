import { HttpError } from "../errors/HttpError";
import { CreateLeadAtributes, ILeadsRepository, LeadStatus, WhereLeadsParams } from "../repositories/leadsRepository";

interface  GetLeadsWhitPaginationParams {
    page?: number,
    pageSize?: number,
    name?: string,
    status?: LeadStatus,
    sortBy?: "name" | "status" | "created_at",
    order?: "asc" | "desc",
}

export class LeadSerivce {
    constructor(private readonly leadsRepository: ILeadsRepository) {}

  async getAllLeadsPaginated(params: GetLeadsWhitPaginationParams) {
    const { page = 1, pageSize = 5, name, status, sortBy, order } = params

    const limit = +pageSize
    const offset = (Number(page) - 1) * limit

    const where: WhereLeadsParams = {}; //faz uma variavel where com o tipo Prisma.LeadWhereInput

    //coloca como case insensitiv-=e no mode
    if (name) where.name = { like: name, mode: "insensitive" }; //se nome existe ent atribui
    if (status) where.status = status; //se status existe ent atribui

    // const leads = await prisma.lead.findMany({
    //     where,
    //     skip: (pageNumber - 1) * pageSizeNumber,
    //     take: pageSizeNumber,
    //     orderBy: { [sortBy]: orderBy},
    //     include:{
    //         Group: true,
    //         campaings: true
    //     }
    // })

    const leads = await this.leadsRepository.find({
      where,
      sortBy,
      order,
      limit,
      offset,
    }); //pega os leads

    // const totalLeads = await prisma.lead.count({where,})

    const total = await this.leadsRepository.count(where);

    return {
        data: leads, pagination: {page: Number(page), pageSize: limit, totalPages: Math.ceil(total / limit)}
    }
  }

  async createLead(params: CreateLeadAtributes) {

    if(!params.status) params.status = "New"
    const newLead = await this.leadsRepository.createLeadAtributes(params) 
    return newLead
  }

  async getLeadById(id:number){
    const lead = await this.leadsRepository.findById(id) //pega a lead pelo id
    if(!lead){
        throw new HttpError("Lead not found", 404) //se nao encontrar o lead
    }
          return lead
  }

  async updateLead(leadId:number, params: Partial<CreateLeadAtributes>){
    const lead = await this.leadsRepository.findById(leadId) //pega a lead pelo id
            if(!lead) throw new HttpError("Lead not found", 404)

            //ve se o status selecionado foi diferente de contacted mesmo o lead sendo new
            if(lead.status === "New" && params.status !== "Contacted" && params.status !== undefined){
                new HttpError("New lead must be contacted before changing its status", 404)
            }    

            if(params.status === "Archived" && params.status !== undefined){ //ve se o status selecionado for archieved
                const now = new Date() //cria uma nova datra de agora pra comparar
                const diffTime = Math.abs(now.getTime() - lead.updated_at.getTime())
                const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)) //calcula a diferença em dias

                if(diffDays < 180) throw new HttpError("Lead must be inactive for 180 days before being archived", 404)
            }

            // const updatedLead = await prisma.lead.update({
            //     where: {id: parseInt(req.params.id)},
            //     data: {name: body.name, status: body.status, phone: body.phone, email: body.email}
            // })

            const updatedLead = await this. leadsRepository.updateById(leadId, params) //atualiza o lead pelo id
  
            return updatedLead
    }

    async deleteLead(leadId:number){
      const leadExists = await this.leadsRepository.findById(leadId)
      if(!leadExists){
          throw new HttpError("Lead not found, try another id", 404)
      }else{
          // const leadDeleted = await prisma.lead.delete({where: {id: parseInt(req.params.id)}})
          const leadDeleted = await this.leadsRepository.deleteById(leadId)
          return leadDeleted
    }
          
}
}