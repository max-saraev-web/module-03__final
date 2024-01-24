import createRow from './createElems';
import fetchRequest from './networking/fetchRequest';

const renderGoods = async (arr, tBody) => {
  const data = await fetchRequest(arr + 'api/goods', {
    method: 'get',
  });
  const {goods} = data;
  if (Array.isArray(goods)) {
    tBody.innerHTML = '';
    goods.forEach((elem, i) => {
      tBody.append(createRow(elem, i, arr));
    });
  } else {
    return 'Это не массив!';
  }
};
export default renderGoods;
