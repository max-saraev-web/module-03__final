import createRow, {createElement} from './createElems';
import fetchRequest from './networking/fetchRequest';
import {generateTotalPages, pagesFractions} from './utility';

const pagesControl = async (url, elems, tBody) => {
  const {
    prev,
    next,
    wrap,
    total,
    currentGoods} = elems();

  let pageCounter = 1;
  const pages = await fetchRequest(url + `api/goods`, {
    method: 'GET',
  });
  const {totalCount, goods, pages: totalPages} = pages;

  const output = pagesFractions(totalCount);
  const [start, end] = output[pageCounter - 1];

  currentGoods.textContent = `${start} - ${end}`;
  total.textContent = totalCount;
  const itemsToShow = createElement('select', {}, {
    parent: wrap,
  });

  itemsToShow.append(...generateTotalPages(goods));

  // ! - количество товаров на странице
  itemsToShow.addEventListener('change', async ev => {
    const [start] = output[pageCounter - 1];
    const target = ev.target;
    const goodsPage =
      await fetchRequest(url +
      `api/goods?page=${pageCounter}`, {
        method: 'GET',
      });
    const amountOfGood = goodsPage.goods.slice(0, `${target.value}`);

    currentGoods.textContent = `${start} - ${(start + +target.value) - 1}`;

    tBody.innerHTML = '';
    amountOfGood.forEach((elem, i) => {
      tBody.append(createRow(elem, i, url));
    });
  });
  // ! - стрелочки
  // ! - назад
  prev.addEventListener('click', async ev => {
    ev.preventDefault();
    if (pageCounter === 1) {
      pageCounter = 1;
    } else {
      pageCounter -= 1;
    }
    const [start, end] = output[pageCounter - 1];

    const dataPage =
      await fetchRequest(url +
      `api/goods?page=${pageCounter}`, {
        method: 'GET',
      });

    tBody.innerHTML = '';
    dataPage.goods.forEach((elem, i) => {
      tBody.append(createRow(elem, i, url));
    });
    itemsToShow.innerHTML = '';
    itemsToShow.append(...generateTotalPages(dataPage.goods));
    currentGoods.textContent = `${start} - ${end}`;
  });

  // ! - вперёд
  next.addEventListener('click', async ev => {
    ev.preventDefault();
    if (pageCounter === totalPages) {
      pageCounter = totalPages;
    } else {
      pageCounter += 1;
    }
    const [start, end] = output[pageCounter - 1];

    const dataPage =
      await fetchRequest(url +
      `api/goods?page=${pageCounter}`, {
        method: 'GET',
      });
    tBody.innerHTML = '';
    dataPage.goods.forEach((elem, i) => {
      tBody.append(createRow(elem, i, url));
    });
    itemsToShow.innerHTML = '';
    itemsToShow.append(...generateTotalPages(dataPage.goods));
    currentGoods.textContent = `${start} - ${end}`;
  });
};

export default pagesControl;
