// ! - импорты от webPack(не трогать!)
import './scss/index.scss';

import './index.html';

import {rowControl} from './script/control';
import elems from './script/getDomElems';
import modal from './script/modal';
import renderGoods from './script/render';
import fetchRequest from './script/networking/fetchRequest';
import pagesControl from './script/pagesControl';

const {
  overlay,
  modalForm,
  modalInputDiscount,
  tableBody,
  addBtn,
  cms,
  totalPrice,
  pageControlsElems,
} = elems;

// * - Функционал
const init = async url => {
  modal(overlay, modalForm, modalInputDiscount,
    url, tableBody, totalPrice);
  rowControl(url, cms, overlay, addBtn, totalPrice);
  renderGoods(url, tableBody);
  const total = await fetchRequest(url + 'api/total', {
    method: 'get',
  });
  totalPrice.textContent = `
    $ ${total}
  `;
  pagesControl(url, pageControlsElems, tableBody);
};

document.addEventListener('DOMContentLoaded', () => {
  init('http://localhost:3000/');
});


