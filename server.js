import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

//App config
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:5173',
            'http://localhost:5173',

            'http://127.0.0.1:3030',
            'http://localhost:3030',
        ],
        credentials: true
    }
    app.use(cors(corsOptions))
}

// import { authRoutes } from './api/auth/auth.routes.js'
// import { userRoutes } from './api/user/user.routes.js'
import { toyRoutes } from './api/toy/toy.routes.js'

//Routes
// app.use('/api/auth', authRoutes)
// app.use('/api/user', userRoutes)
app.use('/api/toy', toyRoutes)

//Fallback
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030
app.listen(port, () =>
    console.log(`Server listening on port http://127.0.0.1:${port}/`)
)