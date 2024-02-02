import createRow from './createElems';
import createPreview from './createPreview';
import errorModal from './errorModal';
import fetchRequest from './networking/fetchRequest';
import {toBase64} from './utility';

const priceData = {
  price: 0,
  count: 1,
  discount: 0,
  reset() {
    this.price = 0;
    this.count = 1;
    this.discount = 0;
  },
};

export const openModal = overlay => overlay.classList.add('active');
export const closeModal = (overlay, priceObj) => {
  const form = overlay.querySelector('form');
  form.reset();
  overlay.classList.remove('active');
  priceObj.reset();
  form.total.textContent = '$';
};

const discoutInput = document.querySelector('.modal__input_discount');
const priceInput = document.querySelector('#price');
const countInput = document.querySelector('#count');


priceData.reset();
const finalPrice = obj => {
  const {price, count, discount} = obj;

  const dicountAmount = ((price * count) / 100) * discount;
  if (discount) {
    return (price * count) - dicountAmount;
  } else {
    return price * count;
  }
};

const message = document.createElement('span');
message.classList.add('file-warning');
message.style.cssText = `
  color: red;
  text-transform: uppercase; 
  text-align: center;
  font-weight: 700;
`;
message.textContent = 'ИЗОБРАЖЕНИЕ НЕ ДОЛЖНО ПРЕВЫЩАТЬ РАЗМЕР 1 МБ';

// const calcTotalForm = obj => {
//   const {count, price, total} = obj;
//   total.textContent = `
//     $ ${count.value * price.value}
//   `;
// };

const modal = (overlay, form, discountTrigger, url, tableBody, totalPrice) => {
  closeModal(overlay, priceData);
  overlay.addEventListener('click', ev => {
    const target = ev.target;

    if (target.closest('.modal__close') || target === overlay) {
      closeModal(overlay, priceData);
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
      closeModal(overlay, priceData);
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
    // obj.pic = obj.image.name;
    obj.id = +overlay.querySelector('.vendor-code__id').textContent;
    let ittr = 0;

    for (let i = 1;
      i < document.querySelectorAll('.table__row').length + 1;
      i++) {
      ittr = i;
    }
    // console.log(obj);
    await fetchRequest(url + `api/goods`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: obj,
      callback: errorModal,
    }).then(() => {
      tableBody.append(createRow(obj, ittr));
      target.total.textContent = `$ 0`;
      target.reset();
      closeModal(overlay, priceData);
    }, (data) => {
      console.log('reject', overlay);
    });
  });

  const fileBtn = form.querySelector('.modal__file');
  const fieldSet = document.querySelector('.modal__fieldset');

  fileBtn.addEventListener('change', async ({target}) => {
    const warning = form.querySelector('.file-warning');
    const prevImg = document.querySelector('.preview');
    if (warning) message.remove();
    if (prevImg) prevImg.remove();

    if (target.files[0].size > 1048567) {
      fieldSet.append(message);
    } else {
      const wrap = createPreview(target.files[0]);
      fieldSet.append(wrap);

      const result = await toBase64(target.files[0]);
    }
  });

  discoutInput.addEventListener('input', ({target}) => {
    target.value = target.value.replace(/\D/gim, '');
    target.value = target.value.slice(0, 2);

    priceData.discount = target.value;
    form.total.textContent = `
    $ ${finalPrice(priceData)}
    `;
  });

  priceInput.addEventListener('input', ({target}) => {
    priceData.price = target.value;
    form.total.textContent = `
      $ ${finalPrice(priceData)}
    `;
  });

  countInput.addEventListener('input', ({target}) => {
    priceData.count = target.value;
    form.total.textContent = `
      $ ${finalPrice(priceData)}
    `;
  });
};

export default modal;
