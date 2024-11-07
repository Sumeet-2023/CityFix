// Notification Routes
import { Router } from "express";
import { 
  getUserNotifications, markNotificationAsRead 
} from "../controller/notificationController";

const router = Router();

router.get('/user/:userId', getUserNotifications);
router.patch('/read/:id', markNotificationAsRead);

export default router;