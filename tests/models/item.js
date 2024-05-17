import { Item, ItemSchema } from "../../lib/models/item.js"

import { expect, assert } from "chai"
import knex from "knex"
import { faker } from "@faker-js/faker"

const table = "items"

describe("Item Schema", () => {
  it("should match item schema", () => {
    assert.deepEqual(ItemSchema.properties.properties, {
      id: { type: "integer" },
      subcategory_id: { type: "integer" },
      category_id: { type: "integer" },
      name: { type: "string" },
      image: { type: "string" },
      description: { type: "string" },
      taxable: { type: "boolean" },
      tax: { type: "number" },
      base_amount: { type: "number" },
      discount: { type: "number" },
      total_amount: { type: "number" },
      created_at: { type: "string" },
      updated_at: { type: "string" },
    })
  })
})

let item

let newItem
let firstItem

describe("Item Model", () => {
  before(() => {
    item = new Item({
      knex: knex({
        client: "mysql2",
        connection: {
          host: "menu-management-sql",
          user: "root",
          password: "root",
          database: "menu",
        },
      }),
    })
  })

  it("should create a new item", () => {
    const randomName = faker.lorem.word()
    const randomImage = faker.image.url()
    const randomDescription = faker.lorem.sentence()
    const randomTaxable = faker.datatype.boolean()
    const randomTax = faker.number.float({ multipleOf: 0.1 })
    const randomBaseAmount = faker.number.float({ multipleOf: 0.1 })
    const randomDiscount = faker.number.float({ multipleOf: 0.1 })
    const randomTotalAmount = faker.number.float({ multipleOf: 0.1 })
    const randomSubcategoryId = faker.number.int(1000)

    return item
      .post({
        name: randomName,
        image: randomImage,
        description: randomDescription,
        taxable: randomTaxable,
        tax: randomTax,
        base_amount: randomBaseAmount,
        discount: randomDiscount,
        total_amount: randomTotalAmount,
        subcategory_id: randomSubcategoryId,
      })
      .then((item) => {
        newItem = item
        expect(item).to.be.an("object")
        expect(item).to.have.property("id")
        expect(item).to.have.property("name")
        expect(item).to.have.property("image")
        expect(item).to.have.property("description")
        expect(item).to.have.property("taxable")
        expect(item).to.have.property("tax")
        expect(item).to.have.property("base_amount")
        expect(item).to.have.property("discount")
        expect(item).to.have.property("total_amount")
        expect(item).to.have.property("subcategory_id")
      })
  })

  it("should get all items", () => {
    return item.get().then((items) => {
      firstItem = items[0]
      expect(items).to.be.an("array")
      expect(items).to.have.length.greaterThan(0)
    })
  })

  it("should get an item by id", () => {
    return item.getBy({ id: newItem.id }).then((item) => {
      expect(item).to.be.an("object")
      expect(item).to.have.property("id")
      expect(item).to.have.property("name")
      expect(item).to.have.property("image")
      expect(item).to.have.property("description")
      expect(item).to.have.property("taxable")
      expect(item).to.have.property("tax")
      expect(item).to.have.property("base_amount")
      expect(item).to.have.property("discount")
      expect(item).to.have.property("total_amount")
    })
  })

  it("should get an item by name", () => {
    return item.getBy({ name: firstItem.name }).then((item) => {
      expect(item).to.be.an("object")
      expect(item).to.have.property("id")
      expect(item).to.have.property("name")
      expect(item).to.have.property("image")
      expect(item).to.have.property("description")
      expect(item).to.have.property("taxable")
      expect(item).to.have.property("tax")
      expect(item).to.have.property("base_amount")
      expect(item).to.have.property("discount")
      expect(item).to.have.property("total_amount")
    })
  })

  it("should update an item", () => {
    const randomName = faker.lorem.word()
    const randomImage = faker.image.url()
    const randomDescription = faker.lorem.sentence()
    const randomTaxable = faker.datatype.boolean()
    const randomTax = faker.number.float({ multipleOf: 0.1 })
    const randomBaseAmount = faker.number.float({ multipleOf: 0.1 })
    const randomDiscount = faker.number.float({ multipleOf: 0.1 })
    const randomTotalAmount = faker.number.float({ multipleOf: 0.1 })

    return item
      .patch({
        id: newItem.id,
        name: randomName,
        image: randomImage,
        description: randomDescription,
        taxable: randomTaxable,
        tax: randomTax,
        base_amount: randomBaseAmount,
        discount: randomDiscount,
        total_amount: randomTotalAmount,
      })
      .then((updatedItem) => {
        expect(updatedItem).to.be.an("object")
        expect(updatedItem).to.have.property("id")
        expect(updatedItem).to.have.property("name")
        expect(updatedItem).to.have.property("image")
        expect(updatedItem).to.have.property("description")
        expect(updatedItem).to.have.property("taxable")
        expect(updatedItem).to.have.property("tax")
        expect(updatedItem).to.have.property("base_amount")
        expect(updatedItem).to.have.property("discount")
        expect(updatedItem).to.have.property("total_amount")
      })
  })
})
