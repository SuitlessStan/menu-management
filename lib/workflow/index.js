import Ajv from "ajv"
import ajvFormats from "ajv-formats"
import Util from "./util/index.js"
import { Category } from "../models/category.js"
import { Subcategory } from "../models/subcategory.js"
import { Item } from "../models/item.js"
import { ItemSchema, CategorySchema, SubcategorySchema } from "./schema.js"

class Middleware {
  constructor(params) {
    this.knex = params.knex
    this.category = new Category(params)
    this.subcategory = new Subcategory(params)
    this.item = new Item(params)
  }

  async getCategories(req, res, next) {
    try {
      req.categories = await this.category.get()
      next()
    } catch (err) {
      res.status(400).send(err)
    }
  }

  async getCategory(req, res, next) {
    try {
      req.category = await this.category.getBy(req.params)
      next()
    } catch (err) {
      res.status(400).send(err)
    }
  }

  async postCategory(req, res, next) {
    let _params = Util.pick(req.body, "name", "image", "description", "taxable", "tax")
    let ajv = ajvFormats(new Ajv({ removeAdditional: true, allowUnionTypes: true }))
    const _validate = ajv.compile(CategorySchema.postCategory)
    let isValid = _validate(_params)

    if (!isValid) {
      Promise.reject(_validate.errors)
    }
    req.category = await this.category.post(_params)
    next()
  }

  async putCategory(req, res, next) {
    let _params = Util.pick(req.body, "name", "image", "description", "taxable", "tax")
    let ajv = ajvFormats(new Ajv({ removeAdditional: true, allowUnionTypes: true }))
    const _validate = ajv.compile(CategorySchema.patchCategory)
    let isValid = _validate(_params)

    if (isValid) {
      try {
        req.category = await this.category.patch(req.params.id, _params)
        next()
      } catch (err) {
        console.error(err)
        res.status(400).send(err)
      }
    }
  }

  async postSubcategory(req, res, next) {
    const queryParam = { id: Number(req.params.category_id) }
    let _params = Util.pick(
      { ...req.body, category_id: queryParam.id },
      "name",
      "image",
      "description",
      "taxable",
      "tax",
      "category_id"
    )
    let ajv = ajvFormats(new Ajv({ removeAdditional: true, allowUnionTypes: true }))
    const _validate = ajv.compile(SubcategorySchema.postSubcategory)
    let isValid = _validate(_params)

    if (!isValid) {
      Promise.reject(_validate.errors)
    }
    req.subcategory = await this.subcategory.post(_params)
    next()
  }

  async getSubcategories(req, res, next) {
    try {
      req.subcategories = await this.subcategory.get()
      next()
    } catch (err) {
      res.status(400).send(err)
    }
  }

  async getSubcategory(req, res, next) {
    if (req.params.id) {
      req.params = { id: Number(req.params.id) }
    }

    try {
      req.subcategory = await this.subcategory.getBy(req.params)
      next()
    } catch (err) {
      res.status(400).send(err)
    }
  }

  async putSubcategory(req, res, next) {
    const queryParam = { id: Number(req.params.id) }

    let _params = Util.pick(
      { ...req.body, queryParam },
      "name",
      "image",
      "description",
      "taxable",
      "tax",
      "category_id"
    )
    let ajv = ajvFormats(new Ajv({ removeAdditional: true, allowUnionTypes: true }))
    const _validate = ajv.compile(SubcategorySchema.patchSubcategory)
    let isValid = _validate(_params)

    try {
      req.subcategory = await this.subcategory.patch(queryParam.id, _params)
    } catch (err) {
      console.error(err)
      res.status(400).send(_validate.errors)
    }
    next()
  }

  async getItems(req, res, next) {
    try {
      req.items = await this.item.get()
      next()
    } catch (err) {
      res.status(400).send(err)
    }
  }

  async getItem(req, res, next) {
    if (req.params.id) {
      req.params = { id: Number(req.params.id) }
    }

    try {
      req.item = await this.item.getBy(req.params)
      next()
    } catch (err) {
      res.status(400).send(err)
    }
  }

  async searchItems(req, res, next) {
    if (!req.query.q) {
      return []
    }

    try {
      req.searchItems = await this.item.get({ q: req.query.q })
      next()
    } catch (err) {
      console.log(err)
    }
  }

  async postItem(req, res, next) {
    const queryParam = req.params.subcategory_id
      ? { subcategory_id: Number(req.params.subcategory_id) }
      : { category_id: Number(req.params.category_id) }

    let _params = Util.pick(
      Object.assign({}, req.body, queryParam),
      "name",
      "image",
      "description",
      "taxable",
      "tax",
      "base_amount",
      "discount",
      "total_amount",
      "subcategory_id",
      "category_id"
    )

    let ajv = ajvFormats(new Ajv({ removeAdditional: true, allowUnionTypes: true }))
    const _validate = ajv.compile(ItemSchema.postItem)
    let isValid = _validate(_params)

    if (_params.base_amount && _params.discount && !_params.total_amount) {
      _params.total_amount = _params.base_amount - _params.discount
    }

    if (!isValid) {
      console.error(_validate.errors)
      Promise.reject(_validate.errors)
    }
    try {
      req.item = await this.item.post(_params)
      next()
    } catch (err) {
      console.error(err)
      res.status(400).send(_validate.errors)
    }
  }

  async putItem(req, res, next) {
    const queryParam = { id: Number(req.params.id) }
    let _params = Util.pick(
      Object.assign({}, req.body, queryParam),
      "id",
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

    let ajv = ajvFormats(new Ajv({ removeAdditional: true, allowUnionTypes: true }))
    const _validate = ajv.compile(ItemSchema.patchItem)
    let isValid = _validate(_params)

    if (!isValid) {
      console.error(_validate.errors)
    }

    req.item = await this.item.patch(_params)
    next()
  }
}
export { Middleware }
