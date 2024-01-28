const overlay = document.querySelector('.overlay');

const modalForm = document.querySelector('.modal__form');

const modalInputDiscount = document.querySelector('.modal__input_discount');

const tableBody = document.querySelector('.table__body');

const addBtn = document.querySelector('.panel__add-goods');

const cms = document.querySelector('.cms');

const totalPrice = document.querySelector('.cms__total-price');

const modalTotal = document.querySelector('.modal__total-price');

const pageControlsElems = () => {
  const block = document.querySelector('.sub-panel');
  const prev = block.querySelector('.sub-panel__left');
  const next = block.querySelector('.sub-panel__right');
  const wrap = block.querySelector('.sub-panel__choice-pages');
  const pagesBlock = block.querySelector('.sub-panel__pages');
  const total = pagesBlock.querySelector('.sub-panel__total');
  const currentGoods = pagesBlock.querySelector('.sub-panel__current-goods');

  return {
    block,
    prev,
    next,
    wrap,
    pagesBlock,
    total,
    currentGoods,
  };
};

export default {
  overlay,
  modalForm,
  modalInputDiscount,
  tableBody,
  addBtn,
  cms,
  totalPrice,
  modalTotal,
  pageControlsElems,
};
