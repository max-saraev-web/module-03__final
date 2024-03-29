import { createElement } from './createElems';
import fetchRequest from './networking/fetchRequest';

export const getId = (min = 1, max = 9) => {
  const fullId = [];

  for (let i = 0; i < 14; i++) {
    if (i === 0) {
      fullId[i] = Math.round(Math.random() * (max - min) + min);
    } else fullId.push(Math.round(Math.random() * (max - min) + min));
  }
  return fullId.join('');
};

export const countRows = () => {
  [...document.querySelectorAll('.table__row')].forEach((elem, i) => {
    elem.querySelector('.table__counter').textContent = i + 1;
  });
};

export const calcTotal = async elems => {
  const data = await fetchRequest(elems, {
    method: 'GET',
  });
  const pureElems = data.map(elem => elem.count * elem.price);
  return pureElems.reduce((acc, val) => acc + val, 0);
};

export const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.addEventListener('loadend', () => {
    resolve(reader.result);
  });

  reader.addEventListener('error', err => {
    reject(err);
  });

  reader.readAsDataURL(file);
});

export const pagesFractions = totalGoods => {
  const fractions = [];

  let start = 1;
  let end = 10;

  while (start <= totalGoods) {
    end = Math.min(end, totalGoods);
    fractions.push([start, end]);

    start += 10;
    end += 10;
  }
  return fractions;
};

export const generateTotalPages = arr => {
  const newArr = [];
  for (let i = 1; i < arr.length + 1; i++) {
    const option = createElement('option', {
      textContent: i,
      value: i,
      selected: `${i === arr.length -1 ? true : false}`,
    });
    newArr.push(option);
  }
  return newArr;
};

export const goodCalcFields = (form, ...elems) => {
  elems.forEach(elem => elem.addEventListener('input', ({target}) => {
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);

    if (target.matches('.modal__input_discount')) {
      target.value = target.value.replace(/\D/gim, '');
      target.value = target.value.slice(0, 2);
    }
    const {price, count, discount, discount_count: discountCount} = obj;

    const dicountAmount = ((price * count) / 100) * discountCount;

    let total = NaN;

    if (discount) {
      total = (price * count) - dicountAmount;
    } else {
      total = price * count;
    }

    form.total.textContent = `
      $ ${total}
    `;
  }));
};
