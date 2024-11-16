import { Router } from "express";
import { getProjectEvents, createEvent, getEventById, updateEvent, deleteEvent } from "../controller/eventController";

const router = Router();

router.get("/:id", getEventById);
router.get("/project/:projectId", getProjectEvents);

router.put("/:eventId", updateEvent);

router.delete("/:eventId", deleteEvent);

router.post("/project/:projectId", createEvent);

export default router;