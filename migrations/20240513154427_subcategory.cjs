exports.up = function (knex) {
  return knex.schema.createTable("subcategory", (table) => {
    table.increments("id").primary()
    table.integer("category_id").unsigned()
    table.string("name").notNullable()
    table.string("image").notNullable()
    table.string("description").notNullable()
    table.boolean("taxable").defaultTo(true)
    table.decimal("tax", 8, 2).defaultTo(0.0)
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("subcategory")
}
