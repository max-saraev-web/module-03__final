import createPreview from './createPreview';
import errorModal from './errorModal';
import fetchRequest from './networking/fetchRequest';
import renderGoods from './render';
import {generateTotalPages, goodCalcFields, pagesFractions,
  toBase64} from './utility';

export const openModal = overlay => overlay.classList.add('active');
export const closeModal = (overlay) => {
  const form = overlay.querySelector('form');
  form.reset();
  overlay.classList.remove('active');
  form.total.textContent = '$';
  const preview = document.querySelector('.preview');
  if (preview) preview.remove();
};

const discoutInput = document.querySelector('.modal__input_discount');
const priceInput = document.querySelector('#price');
const countInput = document.querySelector('#count');
const discountCheckbox = document.querySelector('#discount');

const message = document.createElement('span');
message.classList.add('file-warning');
message.style.cssText = `
  color: red;
  text-transform: uppercase; 
  text-align: center;
  font-weight: 700;
`;
message.textContent = 'ИЗОБРАЖЕНИЕ НЕ ДОЛЖНО ПРЕВЫЩАТЬ РАЗМЕР 1 МБ';


const modal = (overlay, form, discountTrigger, url, tableBody, totalPrice,
    elems) => {
  closeModal(overlay);
  overlay.addEventListener('click', ev => {
    const target = ev.target;

    if (target.closest('.modal__close') || target === overlay) {
      closeModal(overlay);
    }

    if (form.discount.checked) {
      discountTrigger.disabled = false;
    } else if (form.discount.checked === false) {
      discountTrigger.disabled = true;
      discountTrigger.value = '';
    }
  });
  window.addEventListener('keydown', ev => {
    if (ev.code === 'Escape') {
      closeModal(overlay);
    }
  });
  // form.addEventListener('change', () => calcTotalForm(form));

  form.addEventListener('submit', async ev => {
    const target = ev.target;
    ev.preventDefault();
    const formData = new FormData(target);

    let obj = Object.fromEntries(formData);
    obj = Object.assign({title: obj.name}, obj);
    delete obj.name;
    obj.discount = discoutInput.value;

    obj.image = await toBase64(obj.image);
    obj.id = +overlay.querySelector('.vendor-code__id').textContent;

    const getMode = () => {
      const title = overlay.querySelector('.modal__title').textContent;
      if (title === 'Добавить ТОВАР') {
        return 'POST';
      } else {
        return 'PATCH';
      }
    };
    const mode = getMode();
    if (mode === 'PATCH') {
      const {image} = await fetchRequest(url + `api/goods/${obj.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      const imgRegex = /(\d+)\.(webp|jpg|jpeg|png|svg|gif)$/;
      if (imgRegex.test(document.querySelector('.preview__img')?.src) &&
        imgRegex.test(image)) {
        if (document.querySelector('.preview__img').src
          .match(/(\d+)\.(webp|jpg|jpeg|png|svg|gif)$/)[0] ===
          image.match(/(\d+)\.(webp|jpg|jpeg|png|svg|gif)$/)[0]) {
          obj.image = image;
        }
      }
      if (priceInput.value > 0 && discoutInput.value > 0) {
        const dicountAmount = (priceInput.value / 100) * discoutInput.value;
        obj.price = priceInput.value - dicountAmount;
      }

      await fetchRequest(url + `api/goods/${obj.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: `${mode}`,
        body: obj,
        callback: errorModal,
      }).then(async () => {
        renderGoods(url, tableBody);
        target.total.textContent = `$ 0`;
        target.reset();
        closeModal(overlay);
        const total = await fetchRequest(url + 'api/total', {
          method: 'get',
        });
        totalPrice.textContent = `
          $ ${total}
        `;
      }, (data) => {
        console.log('reject', overlay);
      });
    }
    if (mode === 'POST') {
      if (priceInput.value > 0 && discoutInput.value > 0) {
        const dicountAmount = (priceInput.value / 100) * discoutInput.value;
        obj.price = priceInput.value - dicountAmount;
      }
      await fetchRequest(url + `api/goods`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: obj,
        callback: errorModal,
      }).then(async () => {
        renderGoods(url, tableBody);
        target.total.textContent = `$ 0`;

        const select = document.querySelector('select');
        select.innerHTML = '';
        const pages = await fetchRequest(url + `api/goods`, {
          method: 'GET',
        });
        const {totalCount, goods} = pages;
        const {total: totalInpage, currentGoods} = elems();
        const output = pagesFractions(totalCount);
        const [start, end] = output[1];
        currentGoods.textContent = `${start} - ${end}`;
        totalInpage.textContent = totalCount;
        select.append(...generateTotalPages(goods));

        target.reset();
        closeModal(overlay);
        const total = await fetchRequest(url + 'api/total', {
          method: 'get',
        });
        totalPrice.textContent = `
          $ ${total}
        `;
      }, (data) => {
        console.log('reject', overlay);
      });
    }
  });

  const fileBtn = form.querySelector('.modal__file');
  const fieldSet = document.querySelector('.modal__fieldset');

  fileBtn.addEventListener('change', ({target}) => {
    const warning = form.querySelector('.file-warning');
    const prevImg = document.querySelector('.preview');
    if (warning) message.remove();
    if (prevImg) prevImg.remove();

    if (target.files[0].size > 1048567) {
      fieldSet.append(message);
    } else {
      const wrap = createPreview(target.files[0]);
      fieldSet.append(wrap);
    }
  });
  goodCalcFields(form, priceInput, countInput, discountCheckbox, discoutInput);
};

export default modal;
