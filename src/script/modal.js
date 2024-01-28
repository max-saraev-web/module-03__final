import createRow from './createElems';
import createPreview from './createPreview';
import fetchRequest from './networking/fetchRequest';
import {calcTotal, toBase64} from './utility';

export const openModal = overlay => overlay.classList.add('active');
export const closeModal = overlay => overlay.classList.remove('active');

const message = document.createElement('span');
message.classList.add('file-warning');
message.style.cssText = `
  color: red;
  text-transform: uppercase; 
  text-align: center;
  font-weight: 700;
`;
message.textContent = 'ИЗОБРАЖЕНИЕ НЕ ДОЛЖНО ПРЕВЫЩАТЬ РАЗМЕР 1 МБ';

const calcTotalForm = form => {
  const {count, price, total} = form;
  total.textContent = `
    $ ${count.value * price.value}
  `;
};

const modal = (overlay, form, discountTrigger, url, tableBody, totalPrice) => {
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
  form.addEventListener('change', () => calcTotalForm(form));

  form.addEventListener('submit', async ev => {
    const target = ev.target;
    ev.preventDefault();
    const formData = new FormData(target);

    let obj = Object.fromEntries(formData);
    obj = Object.assign({title: obj.name}, obj);
    delete obj.name;

    obj.image = await toBase64(obj.image);
    // obj.pic = obj.image.name;
    obj.id = +overlay.querySelector('.vendor-code__id').textContent;
    let ittr = 0;

    for (let i = 1;
      i < document.querySelectorAll('.table__row').length + 1;
      i++) {
      ittr = i;
    }
    await fetchRequest(url + `api/goods`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: obj,
    });
    console.log(obj);
    tableBody.append(createRow(obj, ittr));
    // totalPrice.textContent = `
    //   $ ${calcTotal(data)}
    // `;
    target.total.textContent = `$ 0`;
    target.reset();
    overlay.classList.remove('active');
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
};

export default modal;
