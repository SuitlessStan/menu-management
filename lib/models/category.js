import Util from "../../lib/workflow/util/index.js"
import Ajv from "ajv"
import ajvFormats from "ajv-formats"
import errors from "../workflow/errors/errors.js"

const table = "category"

class Category {
  constructor(params) {
    this.knex = params.knex
  }

  getBy(params) {
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

  post(category = {}) {
    let ajv = ajvFormats(new Ajv({ removeAddtionalFields: true, allowUnionTypes: true }))

    const validate = ajv.compile(CategorySchema.post)
    let isValid = validate(category)

    if (!isValid) {
      let e = new Error(errors.category_post_validation_error)
      e.statusCode = 400
      e.info = validate.errors

      return Promise.reject(e)
    }

    const { name, image, description, taxable, tax } = category

    return this.knex
      .select()
      .from(table)
      .where({ name: name })
      .then((result) => {
        if (result.length > 0) {
          let e = new Error(errors.category_already_exists)
          e.statusCode = 400
          return Promise.reject(e)
        }

        let _category = Util.pick(category, "name", "image", "description", "taxable", "tax")

        try {
          return this.knex(table)
            .insert(_category)
            .then((result) => Object.assign(category, { id: result[0].insertedId }))
        } catch (error) {
          let e = new Error(errors.category_post_error)
          e.statusCode = 400
          return Promise.reject(e)
        }
      })
  }

  patch(categoryId, updateData) {
    const ajv = ajvFormats(new Ajv({ removeAddtionalFields: true, allowUnionTypes: true }))
    const validate = ajv.compile(CategorySchema.patch)
    const isValid = validate(updateData)

    if (!isValid) {
      const e = new Error(errors.category_patch_validation_error)
      e.statusCode = 400
      e.info = validate.errors
      return Promise.reject(e)
    }

    // Update category with the provided updateData
    return this.knex
      .table(table)
      .where({ id: categoryId })
      .update(updateData)
      .then(() => {
        // Return updated category
        return this.getBy({ id: categoryId })
      })
      .catch((error) => {
        const e = new Error(errors.category_patch_error)
        e.statusCode = 400
        return Promise.reject(e)
      })
  }
}

const CategorySchema = {
  get properties() {
    return {
      id: { type: "integer" },
      name: { type: "string" },
      image: { type: "string" },
      description: { type: "string" },
      taxable: { type: "boolean" },
      tax: { type: "number" },
      tax_type: { type: "string" },
      created_at: { type: "string" },
      updated_at: { type: "string" },
    }
  },

  get post() {
    return {
      $id: "Category/post",
      type: "object",
      properties: Util.pick(this.properties, "name", "image", "description", "taxable", "tax"),
      required: ["name", "image", "description"],
    }
  },

  get patch() {
    return {
      $id: "Category/patch",
      type: "object",
      properties: Util.pick(this.properties, "name", "image", "description", "taxable", "tax"),
    }
  },
}

export { Category, CategorySchema }
