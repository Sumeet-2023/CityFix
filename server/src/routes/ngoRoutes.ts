import { Router } from "express";
import { getNgos } from "../controller/ngoController";

const router = Router();

router.get("/", getNgos);

export default router;