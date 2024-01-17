import { Router } from "express";
import orderController from "./controller/order.controller";


const router = Router();

router.use('/api',orderController.router);

export default router;