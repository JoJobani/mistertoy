import { ObjectId } from "mongodb"
import { dbService } from "../../services/db.service.js"
import { utilService } from "../../services/util.service.js"

export const toyService = {
    query,
    getById,
    remove,
    add,
    update,
    addToyMsg,
    removeToyMsg
}

async function query(filterBy = {}, sortBy = {}) {
    try {
        //Apply filter
        let query = {}
        if (filterBy.txt) {
            query.name = { $regex: filterBy.txt, $options: 'i' }
        }
        if (filterBy.maxPrice) {
            query.price = { $lte: filterBy.maxPrice }
        }
        if (filterBy.inStock) {
            query.inStock = JSON.parse(filterBy.inStock)
        }
        if (filterBy.labels && filterBy.labels.length) {
            query.labels = { $all: filterBy.labels }
        }
        //Apply sort
        let sort = {}
        if (sortBy.type) {
            const sortDir = sortBy.desc === '1' ? 1 : -1
            if (sortBy.type === 'name') {
                sort = { name: sortDir }
            } else if (sortBy.type === 'price' || sortBy.type === 'createdAt') {
                sort = { [sortBy.type]: sortDir }
            }
        }
        //Query Mongo
        const collection = await dbService.getCollection('toy')
        const filteredToys = await collection.find(query).sort(sort).toArray()
        return filteredToys
    } catch (err) {
        console.log('Cannot find toys - service')
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.findOne({ _id: ObjectId.createFromHexString(toyId) })
        toy.createdAt = toy._id.getTimeStamp()
        return toy
    } catch (err) {
        console.log(`while finding car ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const { deletedCount } = await collection.deleteOne({ _id: ObjectId.createFromHexString(toyId) })
        return deletedCount
    } catch (err) {
        console.log(`while deleting ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        console.log('Cannot add toy', err)
        throw err
    }
}

async function update(toy) {
    try {
        const toyToSave = {
            name: toy.name,
            price: toy.price,
            labels: toy.labels,
            inStock: toy.inStock
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId.createFromHexString(toy._id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        console.log('Cannot update toy', err)
        throw err
    }
}

async function addToyMsg(toyId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        console.log('Cannot add msg to toy ', err)
        throw err
    }
}

async function removeToyMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        console.log('Cannot remove msg ', err)
        throw err
    }
}