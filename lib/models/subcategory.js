import Util from "../../lib/workflow/util/index.js"
import Ajv from "ajv"
import ajvFormats from "ajv-formats"
import errors from "../workflow/errors/errors.js"
import moment from "moment-timezone"

const table = "subcategory"

class Subcategory {
  constructor(params) {
    this.knex = params.knex
  }

  getBy(params) {
    let ajv = ajvFormats(new Ajv({ removeAddtionalFields: true, allowUnionTypes: true }))
    const validate = ajv.compile(SubcategorySchema.get)
    let isValid = validate(params)

    if (!isValid) {
      let e = new Error(errors.subcategory_get_validation_error)
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

    const { limit, offset } = params

    let raw = this.knex.select().from(table).limit(limit).offset(offset).toSQL()
    return this.knex.raw(raw.sql, raw.bindings).then((result) => result[0])
  }

  post(subcategory = {}) {
    let ajv = ajvFormats(new Ajv({ removeAddtionalFields: true, allowUnionTypes: true }))

    const validate = ajv.compile(SubcategorySchema.post)
    let isValid = validate(subcategory)

    if (!isValid) {
      let e = new Error(errors.subcategory_post_validation_error)
      e.statusCode = 400
      e.info = validate.errors

      return Promise.reject(e)
    }

    const { name, image, description, taxable, tax } = subcategory

    let _subcategory = Util.pick(subcategory, "name", "image", "description", "taxable", "tax", "category_id")

    return this.knex
      .select()
      .from(table)
      .where({ name: name })
      .then((result) => {
        if (result.length > 0) {
          let e = new Error(errors.subcategory_already_exists)
          e.statusCode = 400

          return Promise.reject(e)
        }

        return this.knex(table)
          .insert(_subcategory)
          .then((result) => Object.assign({ id: result[0] }, _subcategory))
      })
  }

  patch(id, subcategory = {}) {
    let ajv = ajvFormats(new Ajv({ removeAddtionalFields: true, allowUnionTypes: true }))

    const validate = ajv.compile(SubcategorySchema.patch)
    let isValid = validate(subcategory)

    if (!isValid) {
      let e = new Error(errors.subcategory_patch_validation_error)
      e.statusCode = 400
      e.info = validate.errors

      return Promise.reject(e)
    }

    let _subcategory = Util.pick(subcategory, "name", "image", "description", "taxable", "tax", "category_id")
    _subcategory.updated_at = moment().utc().format("YYYY-MM-DD HH:mm:ss")

    return this.knex(table)
      .update(_subcategory)
      .where({ id: id })
      .then((result) => Object.assign({ id: id }, _subcategory))
  }
}

const SubcategorySchema = {
  get properties() {
    return {
      id: { type: "integer" },
      category_id: { type: "integer" },
      name: { type: "string" },
      image: { type: "string" },
      description: { type: "string" },
      taxable: { type: "boolean" },
      tax: { type: "number" },
      created_at: { type: "string" },
      updated_at: { type: "string" },
    }
  },
  get: {
    type: "object",
    properties: {
      id: { type: "integer" },
      category_id: { type: "integer" },
      name: { type: "string" },
      image: { type: "string" },
      description: { type: "string" },
      taxable: { type: "boolean" },
      tax: { type: "number" },
      created_at: { type: "string" },
      updated_at: { type: "string" },
    },
  },
  post: {
    type: "object",
    properties: {
      id: { type: "integer" },
      category_id: { type: "integer" },
      name: { type: "string" },
      image: { type: "string" },
      description: { type: "string" },
      taxable: { type: "boolean" },
      tax: { type: "number" },
    },
    required: ["name", "image", "description"],
    additionalProperties: false,
  },
  patch: {
    type: "object",
    properties: {
      name: { type: "string" },
      image: { type: "string" },
      description: { type: "string" },
      taxable: { type: "boolean" },
      tax: { type: "number" },
      category_id: { type: "integer" },
    },
    additionalProperties: false,
  },
}

export { Subcategory, SubcategorySchema }
