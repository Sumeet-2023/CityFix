import express from 'express';
import { getAllCities, getPreferenceData } from '../controller/dashboardController';

const router = express.Router();

router.get('/cities', getAllCities)
router.get('/:city/preference/:preference', getPreferenceData)


export { router as dashboardRoutes };