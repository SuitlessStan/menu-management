exports.up = function (knex) {
  return knex.schema.createTable("items", (table) => {
    table.increments("id").primary()
    table.integer("subcategory_id").unsigned()
    table.integer("category_id").unsigned()
    table.string("name").notNullable()
    table.string("image").notNullable()
    table.string("description").notNullable()
    table.boolean("taxable").defaultTo(true)
    table.decimal("tax", 8, 2).defaultTo(0.0)
    table.decimal("base_amount", 8, 2).notNullable()
    table.decimal("discount", 8, 2).defaultTo(0.0)
    table.float("total_amount")
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("category")
}
