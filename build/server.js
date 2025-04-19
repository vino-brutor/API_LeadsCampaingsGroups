"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const router_1 = require("./router");
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); //inicia o cors, usa o app.use(função do cors)
app.use(express_1.default.json());
app.use(errorHandler_1.errorHandlerMiddleware);
app.use("/api", router_1.router);
// middleware de tratamento de erros
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port: http://localhost:${PORT}/`));
