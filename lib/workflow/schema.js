import Util from "./util/index.js"

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

  get postCategory() {
    return {
      $id: "Category/post",
      type: "object",
      properties: Util.pick(this.properties, "name", "image", "description", "taxable", "tax"),
      required: ["name", "image", "description"],
    }
  },

  get patchCategory() {
    return {
      $id: "Category/patch",
      type: "object",
      properties: Util.pick(this.properties, "name", "image", "description", "taxable", "tax"),
    }
  },
}

const SubcategorySchema = {
  get properties() {
    return {
      id: { type: "integer" },
      name: { type: "string" },
      image: { type: "string" },
      description: { type: "string" },
      taxable: { type: "boolean" },
      tax: { type: "number" },
      created_at: { type: "string" },
      updated_at: { type: "string" },
      category_id: { type: "integer" },
    }
  },

  get postSubcategory() {
    return {
      $id: "Subcategory/post",
      type: "object",
      properties: Util.pick(this.properties, "name", "image", "description", "taxable", "tax", "category_id"),
      required: ["name", "image", "description", "category_id"],
    }
  },

  get patchSubcategory() {
    return {
      $id: "Subcategory/patch",
      type: "object",
      properties: Util.pick(this.properties, "name", "image", "description", "taxable", "tax", "category_id"),
    }
  },
}

const ItemSchema = {
  get properties() {
    return {
      id: { type: "integer" },
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
      subcategory_id: { type: "integer" },
    }
  },

  get postItem() {
    return {
      $id: "Item/post",
      type: "object",
      properties: Util.pick(
        this.properties,
        "name",
        "image",
        "description",
        "taxable",
        "tax",
        "base_amount",
        "discount",
        "total_amount",
        "subcategory_id"
      ),
      required: ["name", "image", "description", "taxable", "tax", "base_amount", "discount"],
    }
  },

  get patchItem() {
    return {
      $id: "Item/patch",
      type: "object",
      properties: Util.pick(
        this.properties,
        "name",
        "image",
        "description",
        "taxable",
        "tax",
        "base_amount",
        "discount",
        "total_amount",
        "subcategory_id"
      ),
      required: ["name", "image", "description", "taxable", "tax", "base_amount", "discount", "total_amount"],
    }
  },
}

export { CategorySchema, SubcategorySchema, ItemSchema }
