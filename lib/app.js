"use strict"
import express from "express"
import { config } from "../config.js"
import Knex from "knex"
import { createRequire } from "module"
import { fileURLToPath } from "url"
import { Middleware } from "./workflow/index.js"
import cors from "cors"
import morgan from "morgan"

const app = express()
app.use(express.json())

class Server {
  constructor(_config) {
    this.knex = Knex({
      client: "mysql2",
      connection: {
        host: _config.mysql.host,
        user: _config.mysql.user,
        password: _config.mysql.password,
        database: _config.mysql.database,
        port: _config.mysql.port || 3306,
        ssl: _config.mysql.ssl || false,
      },
      pool: { min: 0, max: 20 },
    })

    this.middleware = new Middleware({
      knex: this.knex,
      config: _config,
    })

    app.use(cors())
    app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))

    app.get("/v1/health", (req, res, next) => {
      res.context = { status: 200, content: "OK" }
      res.status(res.context.status).send(res.context.content)
      next()
    })

    app.get("/v1/categories", this.middleware.getCategories.bind(this.middleware), (req, res, next) => {
      res.status(200).send(req.categories)
      next()
    })

    app.get("/v1/categories/:id", this.middleware.getCategory.bind(this.middleware), (req, res, next) => {
      res.status(200).send(req.category)
      next()
    })

    app.get("/v1/subcategories", this.middleware.getSubcategories.bind(this.middleware), (req, res, next) => {
      res.status(200).send(req.subcategories)
      next()
    })

    app.get(
      "/v1/subcategories/:id",
      this.middleware.getSubcategory.bind(this.middleware),
      (req, res, next) => {
        res.status(200).send(req.subcategory)
        next()
      }
    )

    app.get("/v1/items", this.middleware.getItems.bind(this.middleware), (req, res, next) => {
      res.status(200).send(req.items)
      next()
    })

    app.get("/v1/items/:id", this.middleware.getItem.bind(this.middleware), (req, res, next) => {
      res.status(200).send(req.item)
      next()
    })

    app.get("/v1/search", this.middleware.searchItems.bind(this.middleware), (req, res, next) => {
      res.status(200).send(req.searchItems)
      next()
    })

    app.post("/v1/categories", this.middleware.postCategory.bind(this.middleware), (req, res, next) => {
      res.status(200).send(req.category)
      next()
    })

    app.post(
      "/v1/categories/:category_id/subcategories",
      this.middleware.postSubcategory.bind(this.middleware),
      (req, res, next) => {
        res.status(200).send(req.subcategory)
        next()
      }
    )

    app.post(
      "/v1/categories/:category_id/items",
      this.middleware.postItem.bind(this.middleware),
      (req, res, next) => {
        res.status(200).send(req.item)
        next()
      }
    )

    app.post(
      "/v1/subcategories/:subcategory_id/items",
      this.middleware.postItem.bind(this.middleware),
      (req, res, next) => {
        res.status(200).send(req.item)
        next()
      }
    )

    app.put("/v1/categories/:id", this.middleware.putCategory.bind(this.middleware), (req, res, next) => {
      res.status(200).send(req.category)
      next()
    })

    app.put(
      "/v1/subcategories/:id",
      this.middleware.putSubcategory.bind(this.middleware),
      (req, res, next) => {
        res.status(200).send(req.subcategory)
        next()
      }
    )

    app.put("/v1/items/:id", this.middleware.putItem.bind(this.middleware), (req, res, next) => {
      res.status(200).send(req.item)
      next()
    })

    app.use((err, req, res, next) => {
      console.error(err.stack)
      res.status(500).send("Something broke!")
    })
  }
}

const require = createRequire(import.meta.url)
const scriptPath = require.resolve(process.argv[1])
const modulePath = fileURLToPath(import.meta.url)
if (scriptPath === modulePath) {
  let _server = new Server(config)
  console.log("Server starting...")

  const server = app.listen(config.port, () => {
    console.log(`Server listening on port: ${config.port}`)
  })
}

export { Server, app }
