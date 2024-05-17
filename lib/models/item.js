import Util from "../../lib/workflow/util/index.js"
import Ajv from "ajv"
import ajvFormats from "ajv-formats"
import errors from "../workflow/errors/errors.js"

const table = "items"

class Item {
  constructor(params) {
    this.knex = params.knex
  }

  getBy(params) {
    let ajv = ajvFormats(new Ajv({ removeAddtionalFields: true, allowUnionTypes: true }))
    const validate = ajv.compile(ItemSchema.get)
    let isValid = validate(params)

    if (!isValid) {
      let e = new Error(errors.item_get_validation_error)
      e.statusCode = 400
      e.info = validate.errors

      return Promise.reject(e)
    }

    let raw = this.knex.select().from(table).where(params).toSQL()
    return this.knex.raw(raw.sql, raw.bindings).then((result) => result[0][0])
  }

  get(params = {}) {
    params.limit = params.limit ? params.limit : 10
    params.offset = params.offset ? params.offset : 0
    params.q = params.q ? params.q : ""

    const { limit, offset, q } = params

    let raw

    if (q.length > 0) {
      raw = this.knex.select().from(table).where("name", "like", q).limit(limit).offset(offset).toSQL()
    } else {
      raw = this.knex.select().from(table).limit(limit).offset(offset).toSQL()
    }
    return this.knex.raw(raw.sql, raw.bindings).then((result) => result[0])
  }

  post(item = {}) {
    let ajv = ajvFormats(new Ajv({ removeAddtionalFields: true, allowUnionTypes: true }))

    const validate = ajv.compile(ItemSchema.post)
    let isValid = validate(item)

    if (!isValid) {
      let e = new Error(errors.item_post_validation_error)
      e.statusCode = 400
      e.info = validate.errors

      return Promise.reject(e)
    }

    const { name, image, description, taxable, tax } = item

    let _item = Util.pick(
      item,
      "name",
      "image",
      "description",
      "taxable",
      "tax",
      "base_amount",
      "discount",
      "total_amount",
      "subcategory_id"
    )

    return this.knex
      .select()
      .from(table)
      .where({ name: name })
      .then((result) => {
        if (result.length > 0) {
          let e = new Error(errors.item_post_duplicate_error)
          e.statusCode = 400
          return Promise.reject(e)
        }

        return this.knex(table).insert(_item)
      })
      .then((result) => Object.assign(_item, { id: result[0] }))
  }

  patch(item = {}) {
    let ajv = ajvFormats(new Ajv({ removeAddtionalFields: true, allowUnionTypes: true }))

    const validate = ajv.compile(ItemSchema.patch)
    let isValid = validate(item)

    if (!isValid) {
      let e = new Error(errors.item_patch_validation_error)
      e.statusCode = 400
      e.info = validate.errors

      return Promise.reject(e)
    }

    const { id } = item

    let _item = Util.pick(
      item,
      "name",
      "image",
      "description",
      "taxable",
      "tax",
      "base_amount",
      "discount",
      "total_amount"
    )

    if (_item.discount && _item.base_amount && !_item.total_amount) {
      _item.total_amount = _item.base_amount - _item.discount
    }

    return this.knex
      .select()
      .from(table)
      .where({ id: id })
      .then((result) => {
        if (result.length === 0) {
          let e = new Error(errors.item_patch_not_found_error)
          e.statusCode = 400
          return Promise.reject(e)
        }

        return this.knex(table).where({ id: id }).update(_item)
      })
      .then((result) => Object.assign(_item, { id: result[0] }))
  }
}

const ItemSchema = {
  properties: {
    type: "object",
    properties: {
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
    },
  },
  get: {
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
      image: { type: "string" },
      description: { type: "string" },
      taxable: { type: "boolean" },
      tax: { type: "number" },
      base_amount: { type: "number" },
      discount: { type: "number" },
      total_amount: { type: "number" },
      subcategory_id: { type: "integer" },
    },
  },
  post: {
    type: "object",
    properties: {
      name: { type: "string" },
      image: { type: "string" },
      description: { type: "string" },
      taxable: { type: "boolean" },
      tax: { type: "number" },
      base_amount: { type: "number" },
      discount: { type: "number" },
      total_amount: { type: "number" },
      subcategory_id: { type: "integer" },
    },
    required: ["name", "image", "description", "taxable", "tax", "base_amount", "discount", "total_amount"],
  },
  patch: {
    type: "object",
    properties: {
      name: { type: "string" },
      image: { type: "string" },
      description: { type: "string" },
      taxable: { type: "boolean" },
      tax: { type: "number" },
      base_amount: { type: "number" },
      discount: { type: "number" },
      total_amount: { type: "number" },
      subcategory_id: { type: "integer" },
    },
    required: ["name", "image", "description", "taxable", "tax", "base_amount", "discount"],
  },
}

export { Item, ItemSchema }
