"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controller/dashboardController");
const router = express_1.default.Router();
exports.dashboardRoutes = router;
router.get('/cities', dashboardController_1.getAllCities);
router.get('/:city/preference/:preference', dashboardController_1.getPreferenceData);
