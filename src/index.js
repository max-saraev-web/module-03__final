// ! - импорты от webPack(не трогать!)
import './scss/index.scss';

import './index.html';

import {rowControl} from './script/control';
import elems from './script/getDomElems';
import modal from './script/modal';
import renderGoods from './script/render';
import fetchRequest from './script/networking/fetchRequest';
import pagesControl from './script/pagesControl';
import searchControl from './script/search';

const {
  overlay,
  modalForm,
  modalInputDiscount,
  tableBody,
  addBtn,
  cms,
  totalPrice,
  pageControlsElems,
  searchInput,
} = elems;

// * - Функционал
const init = async url => {
  modal(overlay, modalForm, modalInputDiscount,
    url, tableBody, totalPrice, pageControlsElems);
  rowControl(url, cms, overlay, addBtn, totalPrice, pageControlsElems);
  renderGoods(url, tableBody);
  const total = await fetchRequest(url + 'api/total', {
    method: 'get',
  });
  totalPrice.textContent = `
    $ ${total}
  `;
  pagesControl(url, pageControlsElems, tableBody);
  searchControl(searchInput, url, tableBody, pageControlsElems);
};

document.addEventListener('DOMContentLoaded', () => {
  init('http://localhost:3000/');
});


