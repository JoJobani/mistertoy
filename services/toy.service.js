
import fs from 'fs'
import { utilService } from './util.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save
}

const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = { txt: '' }) {
    const regex = new RegExp(filterBy.txt, 'i')
    var toysToReturn = toys.filter(toy => regex.test(toy.name))
    if (filterBy.maxPrice) {
        toysToReturn = toysToReturn.filter(toy => toy.price <= filterBy.maxPrice)
    }
    return Promise.resolve(toysToReturn)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such toy')
    toys.splice(idx, 1)
    return _savetoysToFile()
}

function save(toy) {
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
        toyToUpdate.labels = toy.labels
        toyToUpdate.inStock = toy.inStock
        toy = toyToUpdate
    } else {
        toy._id = utilService.makeId()
        toys.push(toy)
    }
    return _savetoysToFile().then(() => toy)
}


function _savetoysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                console.log('Cannot write to toys file', err)
                return reject(err)
            }
            resolve()
        })
    })
}
