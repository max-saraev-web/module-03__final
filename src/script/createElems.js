const createElement =
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

const createRow = (obj, i) => {
  const elem = createElement('tr');
  elem.classList.add('table__row');

  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    const {id, title, category, count, price, units, name, pic} = obj;
    elem.innerHTML = `
      <td class="table__cell table__counter">${i + 1}</td>
      <td class="table__cell table__cell_left table__cell_name" 
        data-id="${id}">
      <span class="table__cell-id">
        id: ${id}</span>${title ? title : name}</td>
      <td class="table__cell table__cell_left">${category}</td>
      <td class="table__cell">${units}</td>
      <td class="table__cell">${count}</td>
      <td class="table__cell">$${price}</td>
      <td class="table__cell table__total-price">$${price * count}</td>
      <td class="table__cell table__cell_btn-wrapper">
        <button data-pic="img/goods/${pic}"
          class="table__btn table__btn_pic"></button>
        <button class="table__btn table__btn_edit"></button>
        <button class="table__btn table__btn_del"></button>
      </td>
    `;
  } else {
    console.log('Это не объект!');
  }
  return elem;
};
export default createRow;
