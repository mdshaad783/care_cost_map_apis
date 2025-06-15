import {Router} from 'express';
import express from 'express'

import {getHospitalsZipAndName} from '../controllers/hospitalController.js';

const router = express.Router();

router.get('/', getHospitalsZipAndName);

export default router;
