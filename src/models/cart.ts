// @ts-nocheck
export default class Cart {
  constructor(oldCart) {
    this.items = oldCart.items || []
    this.purePrice = oldCart.purePrice || 0
    this.deliveryPrice = oldCart.deliveryPrice || 0
    this.totalQuantity = oldCart.totalQuantity || 0
    this.totalPrice = oldCart.totalPrice || 0
  }

  add(item, id, productSize, productQuantity) {
    let storedItem = this.items.find(
      (elem) => elem.item._id == id && elem.size === productSize.size
    )
    if (!storedItem || storedItem.size !== productSize.size) {
      storedItem = {
        item,
        quantity: 0,
        price: 0,
        delivery: 0,
        size: productSize.size,
        sizePrice: productSize.extraPrice ? productSize.extraPrice : 0,
      }
      this.items.push(storedItem)
    }

    storedItem.quantity += productQuantity

    storedItem.delivery = storedItem.item.delivery * storedItem.quantity

    if ('extraPrice' in productSize) {
      storedItem.sizePrice = productSize.extraPrice * storedItem.quantity
    }

    storedItem.price =
      storedItem.item.price * storedItem.quantity +
      storedItem.delivery +
      storedItem.sizePrice

    this.totalQuantity += productQuantity

    this.totalPrice +=
      (storedItem.item.price +
        storedItem.item.delivery +
        (productSize.extraPrice || 0)) *
      productQuantity

    this.deliveryPrice += productQuantity * storedItem.item.delivery

    this.purePrice +=
      (storedItem.item.price + (productSize.extraPrice || 0)) * productQuantity
  }

  removeItem(id, productIndex, productSize) {
    const storedItem = this.items.find(
      (elem) => elem.item._id == id && elem.size === productSize
    )
    this.totalQuantity -= storedItem.quantity
    this.totalPrice -= storedItem.price

    this.deliveryPrice -= storedItem.delivery
    this.purePrice -= storedItem.price - storedItem.delivery

    this.items.splice(productIndex, 1)
  }

  reduceByOne(id, productSize) {
    const storedItem = this.items.find(
      (elem) => elem.item._id == id && elem.size === productSize
    )

    if (storedItem.quantity === 1) {
      return 'Ожидаемое количество является недопустимым.'
    }

    storedItem.quantity--

    this.totalQuantity--

    storedItem.price -=
      storedItem.item.price + storedItem.item.delivery + storedItem.sizePrice

    storedItem.delivery -= storedItem.item.delivery

    this.totalPrice -=
      storedItem.item.price + storedItem.item.delivery + storedItem.sizePrice

    this.deliveryPrice -= storedItem.item.delivery

    this.purePrice -= storedItem.item.price + storedItem.sizePrice
  }

  increaseByOne(id, productSize) {
    const storedItem = this.items.find(
      (elem) => elem.item._id == id && elem.size === productSize
    )

    storedItem.quantity++

    storedItem.price +=
      storedItem.item.price + storedItem.item.delivery + storedItem.sizePrice

    storedItem.delivery += storedItem.item.delivery

    this.totalQuantity++

    this.totalPrice +=
      storedItem.item.price + storedItem.item.delivery + storedItem.sizePrice

    this.deliveryPrice += storedItem.item.delivery

    this.purePrice += storedItem.item.price + storedItem.sizePrice
  }

  setSize(id, size, productIndex) {
    let storedItem = this.items.find((elem, index) => index === productIndex)

    if (storedItem.size === size.size) {
      return
    }

    storedItem.size = size.size

    if (
      this.items.filter((elem) => {
        return (
          elem.size === storedItem.size && elem.item._id == storedItem.item._id
        )
      }).length >= 2
    ) {
      const deletedItem = this.items.splice(productIndex, 1)

      const singleItem = this.items.find(
        (el) => el.size == size.size && el.item._id == id
      )
      singleItem.quantity += deletedItem[0].quantity
      singleItem.delivery += deletedItem[0].delivery

      if ('extraPrice' in size) {
        singleItem.price +=
          deletedItem[0].price + size.extraPrice * deletedItem[0].quantity
      } else {
        singleItem.price += deletedItem[0].price - deletedItem[0].sizePrice
      }

      this.totalPrice = this.items.reduce((acc, item) => {
        return acc + item.price
      }, 0)

      this.purePrice = this.items.reduce((acc, item) => {
        return acc + item.price - item.delivery
      }, 0)

      return
    }

    storedItem.sizePrice = size.extraPrice * storedItem.quantity || 0

    storedItem.price =
      (storedItem.item.price + storedItem.item.delivery) * storedItem.quantity +
      storedItem.sizePrice

    this.totalPrice = this.items.reduce((acc, item) => {
      return acc + item.price
    }, 0)

    this.purePrice = this.items.reduce((acc, item) => {
      return acc + item.price - item.delivery
    }, 0)
  }
}
