const db = require('../db/index');
const pgp = require('pg-promise')();

class Product {
  constructor({ name, descr, max_qty, available, size, category='MSC', price }) {
    this.name = name;
    this.descr = descr;
    this.max_qty = max_qty;
    this.available = available;
    this.size = size;
    this.category = category;
    this.price = price;
  }

  saveProduct = async () => {
    try {
      await db.query(
        `INSERT INTO product (product_name, description, max_qty, available, size, category_code, price) VALUES(:1, :2, :3, :4, :5, :6, :7)`,
        [this.name, this.descr, this.max_qty, this.available, this.size, this.category ,this.price]
      )
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // save product bulk - to be created
  static saveProductsBulk = async (products) => {
    try {
      const values = products.map((product) => {
        return {
          product_name: product.name,
          description: product.descr,
          max_qty: product.max_qty,
          available: product.available,
          size: product.size,
          category_code: product.category,
          price: product.price
        }
      });

      const columns = ['product_name', 'description', 'max_qty', 'available', 'size', 'category_code', 'price']
      const query = pgp.helpers.insert(values, columns, 'product');

      console.log(query);
      await db.query(
        `${query} ON CONFLICT (product_name, size) DO UPDATE SET
        description = excluded.description,
        max_qty = excluded.max_qty,
        available = excluded.available,
        size = excluded.size,
        category_code = excluded.category_code,
        price = excluded.price`
      );
    } catch(err) {
      throw new Error(err.message);
    }
  }

  static getAllProducts = async () => {
    try {
      const resp = await db.query(
        `SELECT product_name, description, max_qty, available, size, category_code, price FROM product`,
        []
      )
      return resp.rows;
    } catch(err) {
      throw new Error(err.message);
    }
  }
}

module.exports = { Product }
