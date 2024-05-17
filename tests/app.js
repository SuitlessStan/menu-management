import { Server, app } from "../lib/app.js"
import supertest from "supertest"
import { assert } from "chai"
import { config } from "../config.js"
import { faker } from "@faker-js/faker"

let server = app.listen(80)
let _server = new Server(config)

describe("API Tests", () => {
  it("GET /v1/health", (done) => {
    supertest(server)
      .get("/v1/health")
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.equal(res.text, "OK")
          done()
        }
      })
  })

  it("GET /v1/categories", (done) => {
    supertest(server)
      .get("/v1/categories")
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.isArray(res.body)
          done()
        }
      })
  })

  it("GET /v1/categories/:id", (done) => {
    supertest(server)
      .get("/v1/categories/1")
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.isObject(res.body)
          done()
        }
      })
  })

  it("POST /v1/categories", (done) => {
    const randomName = faker.lorem.word()
    const randomImage = faker.image.url()
    const randomDescription = faker.lorem.sentence()
    const randomTaxable = faker.datatype.boolean()
    const randomTax = faker.number.float({ multipleOf: 0.1 })

    supertest(server)
      .post("/v1/categories")
      .send({
        name: randomName,
        image: randomImage,
        description: randomDescription,
        taxable: randomTaxable,
        tax: randomTax,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.isObject(res.body)
          done()
        }
      })
  })

  it("GET /v1/subcategories", (done) => {
    supertest(server)
      .get("/v1/subcategories")
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.isArray(res.body)
          done()
        }
      })
  })

  it("GET /v1/subcategories/:id", (done) => {
    supertest(server)
      .get("/v1/subcategories/1")
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.isObject(res.body)
          done()
        }
      })
  })

  it("POST /v1/categories/:category_id/subcategories", (done) => {
    const randomName = faker.lorem.word()
    const randomImage = faker.image.url()
    const randomDescription = faker.lorem.sentence()
    const category_id = 1

    supertest(server)
      .post("/v1/categories/1/subcategories")
      .send({
        name: randomName,
        image: randomImage,
        description: randomDescription,
        category_id: category_id,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.isObject(res.body)
          done()
        }
      })
  })

  it("GET /v1/items", (done) => {
    supertest(server)
      .get("/v1/items")
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.isArray(res.body)
          done()
        }
      })
  })

  it("GET /v1/items/:id", (done) => {
    supertest(server)
      .get("/v1/items/1")
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.isObject(res.body)
          done()
        }
      })
  })

  it("POST /v1/categories/:category_id/items", (done) => {
    const randomName = faker.lorem.word()
    const randomImage = faker.image.url()
    const randomDescription = faker.lorem.sentence()
    const randomTaxable = faker.datatype.boolean()
    const randomTax = faker.number.float({ multipleOf: 0.1 })
    const randomBaseAmount = faker.number.float({ multipleOf: 0.1 })
    const randomDiscount = faker.number.float({ multipleOf: 0.1 })
    supertest(server)
      .post("/v1/categories/1/items")
      .send({
        name: randomName,
        image: randomImage,
        description: randomDescription,
        taxable: randomTaxable,
        tax: randomTax,
        base_amount: randomBaseAmount,
        discount: randomDiscount,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.isObject(res.body)
          done()
        }
      })
  })

  it("POST /v1/subcategories/:subcategory_id/items", (done) => {
    const randomName = faker.lorem.word()
    const randomImage = faker.image.url()
    const randomDescription = faker.lorem.sentence()
    const randomTaxable = faker.datatype.boolean()
    const randomTax = faker.number.float({ multipleOf: 0.1 })
    const randomBaseAmount = faker.number.float({ multipleOf: 0.1 })
    const randomDiscount = faker.number.float({ multipleOf: 0.1 })
    supertest(server)
      .post("/v1/subcategories/1/items")
      .send({
        name: randomName,
        image: randomImage,
        description: randomDescription,
        taxable: randomTaxable,
        tax: randomTax,
        base_amount: randomBaseAmount,
        discount: randomDiscount,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.isObject(res.body)
          done()
        }
      })
  })

  it("PUT /v1/categories/:id", (done) => {
    const randomName = faker.lorem.word()
    const randomImage = faker.image.url()
    const randomDescription = faker.lorem.sentence()
    const randomTaxable = faker.datatype.boolean()
    const randomTax = faker.number.float({ multipleOf: 0.1 })
    supertest(server)
      .put("/v1/categories/1")
      .send({
        name: randomName,
        image: randomImage,
        description: randomDescription,
        taxable: randomTaxable,
        tax: randomTax,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.isObject(res.body)
          done()
        }
      })
  })

  it("PUT /v1/subcategories/:id", (done) => {
    const randomName = faker.lorem.word()
    const randomImage = faker.image.url()
    const randomDescription = faker.lorem.sentence()
    const category_id = 1
    supertest(server)
      .put("/v1/subcategories/1")
      .send({
        name: randomName,
        image: randomImage,
        description: randomDescription,
        category_id: category_id,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.isObject(res.body)
          done()
        }
      })
  })

  it("PUT /v1/items/:id", (done) => {
    const randomName = faker.lorem.word()
    const randomImage = faker.image.url()
    const randomDescription = faker.lorem.sentence()
    const randomTaxable = faker.datatype.boolean()
    const randomTax = faker.number.float({ multipleOf: 0.1 })
    const randomBaseAmount = faker.number.float({ multipleOf: 0.1 })
    const randomDiscount = faker.number.float({ multipleOf: 0.1 })
    supertest(server)
      .put("/v1/items/1")
      .send({
        name: randomName,
        image: randomImage,
        description: randomDescription,
        taxable: randomTaxable,
        tax: randomTax,
        base_amount: randomBaseAmount,
        discount: randomDiscount,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.isObject(res.body)
          done()
        }
      })
  })
})

describe("Search parameter", () => {
  it("GET /v1/items?search=1", (done) => {
    supertest(server)
      .get("/v1/items?search=1")
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          assert.isArray(res.body)
          done()
        }
      })
  })
})
