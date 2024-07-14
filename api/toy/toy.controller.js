import { toyService } from './toy.service.js'

export async function getToys(req, res) {
    try {
        const { filterBy = {}, sortBy = {} } = req.query
        const toys = await toyService.query(filterBy, sortBy)
        res.json(toys)
    } catch (err) {
        console.log('Error getting toys ', err)
        res.status(500).send({ err: 'Failed to get cars' })
    }
}

export async function getToyById(req, res) {
    try {
        const { toyId } = req.params
        const toy = await toyService.getById(toyId)
        res.json(toy)
    } catch (err) {
        console.log('Error getting toy ', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function addToy(req, res) {
    try {
        const toy = req.body
        const addedToy = await toyService.add(toy)
        res.json(addedToy)
    } catch (err) {
        console.log('Error adding toy ', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

export async function updateToy(req, res) {
    try {
        const toy = req.body
        const updatedToy = await toyService.update(toy)
        res.json(updatedToy)
    } catch (err) {
        console.log('Error updating toy ', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req, res) {
    try {
        const { toyId } = req.params
        const deletedCount = await toyService.remove(toyId)
        res.json(`${deletedCount} toys removed`)
    } catch (err) {
        console.log('Error removing toy ', err)
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
        console.log('Error adding message ', err)
        res.status(500).send({ err: 'Failed to update toy messages' })
    }
}

export async function removeToyMsg(req, res) {
    try {
        const { toyId, msgId } = req.params
        const removedId = await toyService.removeToyMsg(toyId, msgId)
        res.json(removedId)
    } catch (err) {
        console.log('Error removing message ', err)
        res.status(500).send({ err: 'Failed to update toy messages' })
    }
}