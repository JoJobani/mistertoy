import fs from 'fs'
import { utilService } from './util.service.js'

const toys = utilService.readJsonFile('data/toy.json')

export const toyService = {
    query,
    getById,
    remove,
    save
}

function query(filterBy = {}, sortBy = {}) {
    let filteredToys = toys

    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        filteredToys = filteredToys.filter(toy => regex.test(toy.name))
    }
    if (filterBy.maxPrice) {
        filteredToys = filteredToys.filter(toy => toy.price <= filterBy.maxPrice)
    }
    if (filterBy.inStock) {
        filteredToys = filteredToys.filter(toy => toy.inStock === JSON.parse(filterBy.inStock))
    }
    if (filterBy.labels && filterBy.labels.length) {
        filteredToys = filteredToys.filter(toy =>
            filterBy.labels.every(label => toy.labels.includes(label))
        )
    }
    if (sortBy.type) {
        filteredToys.sort((toy1, toy2) => {
            const sortDir = +sortBy.desc
            if (sortBy.type === 'name') {
                return toy1.name.localeCompare(toy2.name) * sortDir
            } else if (sortBy.type === 'price' || sortBy.type === 'createdAt') {
                return (toy1[sortBy.type] - toy2[sortBy.type]) * sortDir
            }
        })
    }
    return Promise.resolve(filteredToys)
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
        const idx = toys.findIndex(currToy => currToy._id === toy._id)
        toys[idx] = { ...toys[idx], ...toy }
    } else {
        toy._id = utilService.makeId()
        toy.createdAt = Date.now()
        toy.inStock = true
        toys.unshift(toy)
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
