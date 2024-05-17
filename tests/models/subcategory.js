import { Subcategory, SubcategorySchema } from "../../lib/models/subcategory.js"
import { expect, assert } from "chai"
import knex from "knex"
import { faker } from "@faker-js/faker"

const table = "subcategory"

describe("Subcategory Schema", () => {
  it("should match subcategory schema", () => {
    assert.deepEqual(SubcategorySchema.properties, {
      id: { type: "integer" },
      name: { type: "string" },
      image: { type: "string" },
      description: { type: "string" },
      taxable: { type: "boolean" },
      tax: { type: "number" },
      created_at: { type: "string" },
      updated_at: { type: "string" },
      category_id: { type: "integer" },
    })
  })
})

let subcategory

let firstSubcategory

describe("Subcategory Model", () => {
  before(() => {
    subcategory = new Subcategory({
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

  it("should create a new subcategory", () => {
    const randomName = faker.lorem.word()
    const randomImage = faker.image.url()
    const randomDescription = faker.lorem.sentence()
    const randomTaxable = faker.datatype.boolean()
    const randomTax = faker.number.float({ multipleOf: 0.1 })

    return subcategory
      .post({
        name: randomName,
        image: randomImage,
        description: randomDescription,
        taxable: randomTaxable,
        tax: randomTax,
      })
      .then((subcategory) => {
        expect(subcategory).to.have.property("id")
        expect(subcategory).to.have.property("name")
        expect(subcategory).to.have.property("image")
        expect(subcategory).to.have.property("description")
        expect(subcategory).to.have.property("taxable")
        expect(subcategory).to.have.property("tax")
      })
  })

  it("should return all subcategories", () => {
    return subcategory.get().then((subcategories) => {
      firstSubcategory = subcategories[0]
      expect(subcategories).to.have.length
      expect(firstSubcategory).to.have.property("id")
      expect(firstSubcategory).to.have.property("name")
      expect(firstSubcategory).to.have.property("image")
      expect(firstSubcategory).to.have.property("description")
      expect(firstSubcategory).to.have.property("taxable")
      expect(firstSubcategory).to.have.property("tax")
      expect(firstSubcategory).to.have.property("created_at")
      expect(firstSubcategory).to.have.property("updated_at")
    })
  })

  it("should update a subcategory", () => {
    const randomName = faker.lorem.word()
    const randomImage = faker.image.url()
    const randomDescription = faker.lorem.sentence()
    const randomTaxable = faker.datatype.boolean()
    const randomTax = faker.number.float({ multipleOf: 0.1 })

    return subcategory
      .patch(firstSubcategory.id, {
        name: randomName,
        image: randomImage,
        description: randomDescription,
        taxable: randomTaxable,
        tax: randomTax,
      })
      .then((subcategory) => {
        expect(subcategory).to.have.property("id")
        expect(subcategory).to.have.property("name")
        expect(subcategory).to.have.property("image")
        expect(subcategory).to.have.property("description")
        expect(subcategory).to.have.property("taxable")
        expect(subcategory).to.have.property("tax")
      })
  })
})
