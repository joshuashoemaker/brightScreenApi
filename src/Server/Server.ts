import * as express from 'express'
import * as mongoose from 'mongoose'
import * as path from 'path'
import { json } from 'body-parser'
import apiRouter from '../Routes/apiRoute'

class Server {
  app: express.Application
  constructor () {
    this.createApp()
    this.createRoutes()
    this.setOptions()
  }

  createApp (): void {
    this.app = express()
    this.app.use(json())
    this.app.use(express.static(path.join(process.cwd(), '/web/build')))
    this.connectToDatabase()
  }

  createRoutes (): void {
    this.app.use('/api', apiRouter)
    this.app.use('/', (request, response, next) => {
      response.sendFile(path.join(process.cwd(), './web/build/index.html'))
    })
  }

  connectToDatabase () {
    mongoose.connect(process.env.DBCONNECTION, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, () => {
      console.log('Connected to Database')
    })
  }

  setOptions (): void {
    this.app.use((request, response, next) => {
      response.header('Access-Control-Allow-Origin', request.headers.origin || '*')
      response.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,HEAD,DELETE,OPTIONS')
      response.header('Access-Control-Allow-Headers', 'Content-Type,x-requested-with')
      next()
    })
  }
}

export default Server
