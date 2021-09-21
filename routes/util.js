const Increment = require('../models/Increment');

class Util {
  static async getID(name) {
    const id = await Increment.findOne({ name: name });
    return id.currentValue;
  }

  static async initialize() {
    let collectionNames = ['Admin', 'Archive', 'Food', 'Ingredient', 'Order', 'User'];
    for (let name of collectionNames) {
      const newID = new Increment({
        name: name,
        currentValue: 0,
      })
      newID.save();
    }
  }

  static async incrementID(name) {
    const id = await Increment.findOne({ name: name });
    id.currentValue += 1;
    await id.save();
  }
}

module.exports = Util;