import express from 'express';
import { generateItinerary, getItinerary, saveItinerary } from '../controllers/itineraryController.js';

const router = express.Router();

router.post('/generate', generateItinerary);
router.post('/save', saveItinerary);
router.get('/:id', getItinerary);

export default router;
