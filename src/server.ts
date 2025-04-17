import cors from "cors"
import express from "express"
import { router } from "./router"
import { errorHandlerMiddleware } from "./middlewares/errorHandler"

const app = express()

app.use(cors()) //inicia o cors, usa o app.use(função do cors)
app.use(express.json())
app.use(errorHandlerMiddleware)
app.use("/api", router)
// middleware de tratamento de erros


const PORT = 3000
app.listen(PORT, () => console.log(`Server is running on port: http://localhost:${PORT}/`))