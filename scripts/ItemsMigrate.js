const db = require('../db/index');
const { Item, createItem } = require('../models/Item');
const xlsx = require('xlsx');


async function updateItemsTable() {
  const workbook = xlsx.readFile('../data/itemsDetails.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, {...opts, header: 1});

  for (const item of data) {
    const newItem = new Item(item);
    try {
      await newItem.createItem();
    } catch(err) {
      throw new Error();
    }
  }
}

updateItemsTable();

