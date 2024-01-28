import createRow from './createElems';
import fetchRequest from './networking/fetchRequest';
import {generateTotalPages, pagesFractions} from './utility';

const searchControl = (input, url, tBody, dataList) => {
  let intervalId;

  input.addEventListener('input', ({target}) => {
    clearInterval(intervalId);

    const releaseInput = async str => {
      const pageCounter = 1;
      const dataPage =
        await fetchRequest(url +
        `api/goods?search=${str}`, {
          method: 'GET',
        });

      const {goods, totalCount} = dataPage;
      tBody.innerHTML = '';
      goods.forEach((elem, i) => {
        tBody.append(createRow(elem, i, url));
      });
      const {wrap, currentGoods, total} = dataList();
      const output = pagesFractions(totalCount);
      const [start, end] = output[pageCounter - 1];

      currentGoods.textContent = `${start} - ${end}`;
      total.textContent = totalCount;
      const displayAmount = wrap.querySelector('select');
      displayAmount.innerHTML = '';
      displayAmount.append(...generateTotalPages(goods));
    };

    intervalId = setTimeout(() => {
      releaseInput(target.value);
    }, 1000);
  });
};

export default searchControl;
