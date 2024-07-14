import express from 'express'

// import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { getToys, getToyById, addToy, updateToy, removeToy, addToyMsg, removeToyMsg } from './toy.controller.js'
import { log } from '../../services/logger.service.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', log, getToys)
toyRoutes.get('/:toyId', getToyById)
toyRoutes.post('/', log, addToy)
// toyRoutes.post('/',log, requireAdmin, addToy)
toyRoutes.put('/', updateToy)
// toyRoutes.put('/', requireAdmin, updateToy)
toyRoutes.delete('/:toyId', removeToy)
// toyRoutes.delete('/:toyId', requireAdmin, removeToy)

// toyRoutes.post('/:toyId/msg', requireAuth, addToyMsg)
// toyRoutes.delete('/:toyId/msg', requireAuth, removeToyMsg)