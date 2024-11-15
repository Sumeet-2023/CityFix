"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exploreController_1 = require("../controller/exploreController");
const router = (0, express_1.Router)();
router.get("/", exploreController_1.getNearbyAll);
router.get("/clan", exploreController_1.getClanAutocomplete);
exports.default = router;
