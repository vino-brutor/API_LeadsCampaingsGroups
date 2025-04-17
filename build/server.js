"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); //inicia o cors, usa o app.use(função do cors)
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port: http://localhost:${PORT}/`));
