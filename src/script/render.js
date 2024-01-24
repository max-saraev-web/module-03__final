import createRow from './createElems';

const renderGoods = (arr, tBody) => {
  if (Array.isArray(arr)) {
    tBody.innerHTML = '';
    arr.forEach((elem, i) => {
      tBody.append(createRow(elem, i));
    });
  } else {
    return 'Это не массив!';
  }
};
export default renderGoods;
