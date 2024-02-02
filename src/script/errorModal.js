import {createElement} from './createElems';

const errorModal = data => {
  const modalForm = document.querySelector('.modal__form');

  const errorBlock = createElement('div', {
    className: 'modal__error-block',
    style: `
      display: flex;
      flex-direction: column;
      gap: 33px;
    `,
  }, {
    appends: [createElement('div', {
      innerHTML: `
        <svg width="94" height="94" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2L92 92" stroke="#D80101" stroke-width="3" stroke-linecap="round"/>
        <path d="M2 92L92 2" stroke="#D80101" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `,
      width: '90px',
      height: '90px',
    }),
    createElement('p', {
      className: 'modal__error-text',
      textContent: 'Что-то пошло не так',
    }),
    createElement('p', {
      className: 'modal__error-text',
      textContent: `${data}`,
    })],
  });

  const errorModal = createElement('div', {
    className: 'modal__error',
    style: `
      position: absolute;
      background: #F2F0F9;
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: flex-end;
      justify-content: center;
}
    `,
  }, {
    append: errorBlock,
    parent: modalForm,
  });

  const closeBtn = createElement('button', {
    className: 'modal__error-btn',
    innerHTML: `
      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m2 2 20 20M2 22 22 2" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
    `,
  }, {
    parent: errorModal,
  });

  closeBtn.addEventListener('click', () => {
    errorModal.remove();
  });

  return Promise.reject(data);
};
export default errorModal;
