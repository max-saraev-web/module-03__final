export const createElement =
  (tag, attr, {append, appends, parent, cb} = {}) => {
    const element = document.createElement(tag);

    if (attr) {
      Object.assign(element, attr);
    }

    if (append && append instanceof HTMLElement) {
      element.append(append);
    }

    if (appends && appends.every(elem => elem instanceof HTMLElement)) {
      element.append(...appends);
    }

    if (parent && parent instanceof HTMLElement) {
      parent.append(element);
    }

    if (cb && typeof cb === 'function') {
      cb(element);
    }

    return element;
  };

const createRow = (obj, i, url) => {
  const elem = createElement('tr');
  elem.classList.add('table__row');

  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    const reverseDiscount = (discountedPrice, discount) =>
      discountedPrice / (1 - discount / 100);

    let fixedOutput = NaN;
    if (obj.discount > 0) {
      fixedOutput = reverseDiscount(obj.price, obj.discount);
    }

    const {id, title, category, count, price, units, name, image: pic,
      discount = 0} = obj;
    const dicountAmount = ((Math.floor(fixedOutput) * count) / 100) * discount;

    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = `${url}${pic}`;
      img.addEventListener('load', () => {
        resolve(true);
      });
      img.addEventListener('error', () => {
        reject(false);
      });
    }).then(trigger => {
      elem.innerHTML = `
      <td class="table__cell table__counter">${i + 1}</td>
      <td class="table__cell table__cell_left table__cell_name" 
        data-id="${id}">
      <span class="table__cell-id">
        id: ${id}</span>${title ? title : name}</td>
      <td class="table__cell table__cell_left">${category}</td>
      <td class="table__cell">${units}</td>
      <td class="table__cell">${count}</td>
      <td class="table__cell">$${fixedOutput > 0 ?
        Math.floor(fixedOutput) : price}</td>
      <td class="table__cell table__total-price">$${dicountAmount > 0 ?
        (Math.floor(fixedOutput) * count) - dicountAmount : price * count}</td>
      <td class="table__cell table__cell_btn-wrapper">
        <button data-pic="${url}${pic}"
          class="table__btn table__btn_pic${trigger === true ?
            '' : '-empty'}"></button>
        <button class="table__btn table__btn_edit"></button>
        <button class="table__btn table__btn_del"></button>
      </td>
    `;
    }, trigger => {
      elem.innerHTML = `
      <td class="table__cell table__counter">${i + 1}</td>
      <td class="table__cell table__cell_left table__cell_name" 
        data-id="${id}">
      <span class="table__cell-id">
        id: ${id}</span>${title ? title : name}</td>
      <td class="table__cell table__cell_left">${category}</td>
      <td class="table__cell">${units}</td>
      <td class="table__cell">${count}</td>
      <td class="table__cell">$${fixedOutput > 0 ?
        Math.floor(fixedOutput) : price}</td>
      <td class="table__cell table__total-price">$${dicountAmount > 0 ?
        (Math.floor(fixedOutput) * count) - dicountAmount : price * count}</td>
      <td class="table__cell table__cell_btn-wrapper">
        <button data-pic="${url}${pic}"
          class="table__btn table__btn_pic ${trigger === true ?
            '' : 'table__btn_pic-empty'}"></button>
        <button class="table__btn table__btn_edit"></button>
        <button class="table__btn table__btn_del"></button>
      </td>
    `;
    });
  } else {
    console.log('Это не объект!');
  }
  return elem;
};
export const createCategoryList = data => {
  const list = createElement('datalist',
    {
      id: 'category-list',
    },
  );
  const elems = data.map(elem => {
    const option = createElement('option', {
      value: `${elem}`,
    });
    return option;
  });
  list.append(...elems);
  return list;
};
export default createRow;
