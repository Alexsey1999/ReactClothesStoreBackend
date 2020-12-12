// @ts-nocheck
export default class Cart {
  constructor(oldCart) {
    this.items = oldCart.items || {}
    this.purePrice = oldCart.purePrice || 0
    this.deliveryPrice = oldCart.deliveryPrice || 0
    this.totalQuantity = oldCart.totalQuantity || 0
    this.totalPrice = oldCart.totalPrice || 0
  }

  add(item, id) {
    let storedItem = this.items[id]
    if (!storedItem) {
      storedItem = this.items[id] = { item, quantity: 0, price: 0, delivery: 0 }
    }

    storedItem.quantity++
    storedItem.price = storedItem.item.price * storedItem.quantity

    storedItem.delivery = storedItem.item.delivery * storedItem.quantity

    this.totalQuantity++
    this.totalPrice += storedItem.item.price + storedItem.item.delivery
    this.deliveryPrice += storedItem.item.delivery
    this.purePrice += storedItem.item.price
  }

  removeItem(id) {
    this.totalQuantity -= this.items[id].quantity
    this.totalPrice -= this.items[id].price + this.items[id].delivery

    this.deliveryPrice -= this.items[id].delivery
    this.purePrice -= this.items[id].price

    delete this.items[id]
  }

  reduceByOne(id) {
    this.items[id].quantity--
    this.items[id].price -= this.items[id].item.price

    this.totalQuantity--
    this.totalPrice -= this.items[id].item.price

    if (this.items[id].quantity <= 0) {
    }
  }

  increaseByOne(id) {
    this.items[id].quantity++
    this.items[id].price += this.items[id].item.price

    this.totalQuantity++
    this.totalPrice += this.items[id].item.price

    if (this.items[id].quantity > 10) {
    }
  }

  generateArray() {
    const arr = []

    for (let id in this.items) {
      arr.push(this.items[id])
    }

    return arr
  }
}
