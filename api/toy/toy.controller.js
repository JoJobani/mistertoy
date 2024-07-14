import { toyService } from './toy.service.js'
import { logger } from '../../services/logger.service.js'

export async function getToys(req, res) {
    try {
        const { filterBy = {}, sortBy = {} } = req.query
        const toys = await toyService.query(filterBy, sortBy)
        res.json(toys)
    } catch (err) {
        logger.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}

export async function getToyById(req, res) {
    try {
        const { toyId } = req.params
        const toy = await toyService.getById(toyId)
        res.json(toy)
    } catch (err) {
        logger.error('Error getting toy ', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function addToy(req, res) {
    try {
        const toy = req.body
        const addedToy = await toyService.add(toy)
        res.json(addedToy)
    } catch (err) {
        logger.error('Error adding toy ', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

export async function updateToy(req, res) {
    try {
        const toy = req.body
        const updatedToy = await toyService.update(toy)
        res.json(updatedToy)
    } catch (err) {
        logger.error('Error updating toy ', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req, res) {
    try {
        const { toyId } = req.params
        const deletedCount = await toyService.remove(toyId)
        res.json(`${deletedCount} toys removed`)
    } catch (err) {
        logger.error('Error removing toy ', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}

export async function addToyMsg(req, res) {
    const { loggedinUser } = req
    try {
        const { toyId } = req.params
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
            createdAt: Date.now(),
        }
        const savedMsg = await toyService.addToyMsg(toyId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Error adding message ', err)
        res.status(500).send({ err: 'Failed to update toy messages' })
    }
}

export async function removeToyMsg(req, res) {
    try {
        const { toyId, msgId } = req.params
        const removedId = await toyService.removeToyMsg(toyId, msgId)
        res.json(removedId)
    } catch (err) {
        logger.error('Error removing message ', err)
        res.status(500).send({ err: 'Failed to update toy messages' })
    }
}