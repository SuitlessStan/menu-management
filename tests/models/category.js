import { Category, CategorySchema } from "../../lib/models/category.js"

import { expect, assert } from "chai"
import knex from "knex"
import { faker } from "@faker-js/faker"

const table = "category"

describe("Category Schema", () => {
  it("should match category schema", () => {
    assert.deepEqual(CategorySchema.properties, {
      id: { type: "integer" },
      name: { type: "string" },
      image: { type: "string" },
      description: { type: "string" },
      taxable: { type: "boolean" },
      tax: { type: "number" },
      tax_type: { type: "string" },
      created_at: { type: "string" },
      updated_at: { type: "string" },
    })
  })
})

let category

let newCategory
let firstCategory

describe("Category Model", () => {
  before(() => {
    category = new Category({
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

  it("should create a new category", () => {
    const randomName = faker.lorem.word()
    const randomImage = faker.image.url()
    const randomDescription = faker.lorem.sentence()
    const randomTaxable = faker.datatype.boolean()
    const randomTax = faker.number.float({ multipleOf: 0.1 })

    return category
      .post({
        name: randomName,
        image: randomImage,
        description: randomDescription,
        taxable: randomTaxable,
        tax: randomTax,
      })
      .then((category) => {
        expect(category).to.be.an("object")
        expect(category).to.have.property("id")
        newCategory = category
      })
  })

  it("should return all categories", () => {
    return category.get().then((categories) => {
      expect(categories).to.have.length
      firstCategory = categories[0]
    })
  })

  it("should return category by its name", () => {
    const { name } = newCategory

    return category.getBy({ name: name }).then((category) => {
      expect(category).to.be.an("object")
      expect(category).to.have.property("id")
      expect(category).to.have.property("name")
      expect(category).to.have.property("image")
      expect(category).to.have.property("description")
      expect(category).to.have.property("taxable")
      expect(category).to.have.property("tax")
    })
  })

  it("should return category by its id", () => {
    const { id } = firstCategory

    return category.getBy({ id: id }).then((category) => {
      expect(category).to.be.an("object")
      expect(category).to.have.property("id")
      expect(category).to.have.property("name")
      expect(category).to.have.property("image")
      expect(category).to.have.property("description")
      expect(category).to.have.property("taxable")
      expect(category).to.have.property("tax")
    })
  })

  it("should update category by its id", () => {
    const { id } = firstCategory
    const randomName = faker.lorem.word()
    const randomImage = faker.image.url()
    const randomDescription = faker.lorem.sentence()
    const randomTaxable = faker.datatype.boolean()
    const randomTax = faker.number.float({ multipleOf: 0.1 })

    return category
      .patch(id, {
        name: randomName,
        image: randomImage,
        description: randomDescription,
        taxable: randomTaxable,
        tax: randomTax,
      })
      .then((category) => {
        expect(category).to.be.an("object")
        expect(category).to.have.property("id")
        expect(category).to.have.property("name")
        expect(category).to.have.property("image")
        expect(category).to.have.property("description")
        expect(category).to.have.property("taxable")
        expect(category).to.have.property("tax")
      })
  })
})
