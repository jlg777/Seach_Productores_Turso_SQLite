import express from 'express'
import path from 'path'
import { createClient } from '@libsql/client'
import { json } from 'stream/consumers'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
})

// Sirve los archivos estáticos desde la carpeta `build`
app.use(express.static(path.join(process.cwd(), 'build')))
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

// Ruta para manejar el acceso a la raíz y servir el index.html desde build
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'build', 'index.html'))
})

app.get('/api/productores', async (req, res) => {
  try {
    const data = await db.execute('SELECT * FROM productores')
    res.status(201).json(data)
  } catch (error) {
    console.error(error)
  }
})

// Esta es la exportación de la función que Vercel necesita
export default (req, res) => {
  app(req, res) // Pasa las solicitudes y respuestas a la aplicación Express
}

// El servidor escucha en el puerto 3000
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
