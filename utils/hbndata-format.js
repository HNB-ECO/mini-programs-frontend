
// 颜色选择
export function formatGoodSelectedDetail(list) {
  return list.map(item => {
    return {
      name: item.color,
      coinPrice: item.coinPrice,
      price: item.price,
      inventory: item.inventory,
      selected: false
    }
  })
}