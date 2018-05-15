
// 颜色选择
export function formatGoodSelectedDetail(list) {
  return list.map((item,x) => {
    return {
      goodId: item.goodId,
      goodDetailId: item.id,
      sieze: item.sieze ? item.sieze : '',
      volume: item.volume ? item.volume : '',
      weight: item.weight ? item.weight : '',
      color: item.color ? item.color : '',
      coinPrice: item.coinPrice,
      price: item.price,
      inventory: item.inventory,
      imageUrl: item.imageUrl,
      // isShipping: true,
      selected: x == 0 ? true : false
    }
  })
}