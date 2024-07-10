import path from 'path';
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { toyService } from './services/toy.service.js'

const app = express()

//App config
const corsOptions = {
    origin: [
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ],
    credentials: true
}
app.use(cors(corsOptions))

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// **************** Toys API ****************:
//Toy list
app.get('/api/toy', (req, res) => {
    const { filterBy = {}, sortBy = {} } = req.query
    toyService.query(filterBy, sortBy)
        .then((toys) => {
            res.send(toys)
        })
        .catch((err) => {
            loggerService.error('Cannot get toys', err)
            res.status(400).send('Cannot get toys')
        })
})

// toy READ
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.getById(toyId)
        .then((toy) => {
            res.send(toy)
        })
        .catch((err) => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        })
})

// toy CREATE
app.post('/api/toy', (req, res) => {
    const { name, price, labels } = req.body
    const toy = {
        name,
        price: +price,
        labels
    }
    toyService.save(toy)
        .then((savedtoy) => {
            res.send(savedtoy)
        })
        .catch((err) => {
            console.log('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })

})

// toy UPDATE
app.put('/api/toy', (req, res) => {
    const { name, price, _id, labels } = req.body
    const toy = {
        _id,
        name,
        price: +price,
        labels
    }
    toyService.save(toy)
        .then((savedtoy) => {
            res.send(savedtoy)
        })
        .catch((err) => {
            console.log('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })
})

// toy DELETE
app.delete('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.remove(toyId)
        .then(() => {
            res.send('Removed!')
        })
        .catch((err) => {
            console.log('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy')
        })
})

//Fallback
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = 3030
app.listen(port, () =>
    console.log(`Server listening on port http://127.0.0.1:${port}/`)
)