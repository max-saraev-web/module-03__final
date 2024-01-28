import {createCategoryList} from './createElems';
import {openModal} from './modal';
import fetchRequest from './networking/fetchRequest';
import {calcTotal, countRows, getId, toBase64} from './utility';

export const rowControl = async (
    data,
    selector,
    overlay,
    add,
    totalPrice,
) => {
  const dataNew = await fetchRequest(data + 'api/goods', {
    method: 'get',
  });
  // console.log('dataNew: ', dataNew);
  const categories = await fetchRequest(data + 'api/categories', {
    method: 'get',
  }).then(data => createCategoryList(data));

  overlay.addEventListener('click', ({target}) => {
    const overlayClose = overlay.querySelector('.preview__close');
    const preview = overlay.querySelector('.preview');
    const fileInput = overlay.querySelector('.modal__file');
    if (target === overlayClose) {
      fileInput.value = '';
      preview.remove();
    }
  });

  selector.addEventListener('click', async ev => {
    const target = ev.target;

    if (target.matches('.table__btn_edit')) {
      const line =
        target
          .parentElement
          .parentElement.querySelector('.table__cell_name')
          .dataset.id;
      overlay.querySelector('.vendor-code__id').textContent = line;
      overlay.querySelector('.modal__title').textContent = 'Изменить ТОВАР';
      const label = overlay.querySelector('.modal__label_category');
      label.append(categories);

      const goodData = await fetchRequest(data + `api/goods/${line}`, {
        method: 'get',
      });

      const discontCountField = overlay.querySelector('form')['discount_count'];
      const formElements = overlay.querySelector('form').elements;
      const {
        name,
        category,
        description,
        units,
        discount,
        count,
        price} = formElements;
      name.value = `${goodData.title}`;
      category.value = `${goodData.category}`;
      description.value = `${goodData.description}`;
      units.value = `${goodData.units}`;
      count.value = `${goodData.count}`;
      price.value = `${goodData.price}`;
      if (goodData.discount) {
        discount.checked = true;
        discontCountField.value = `${goodData.discount}`;
      } else {
        discount.checked = false;
        discontCountField.value = '';
        discontCountField.disabled;
      }
      openModal(overlay);
    }

    if (target === add) {
      overlay.querySelector('.vendor-code__id').textContent = getId();
      const label = overlay.querySelector('.modal__label_category');
      label.append(categories);
      openModal(overlay);
    }
    if (target.matches('.table__btn_del')) {
      const line =
        target
          .parentElement
          .parentElement.querySelector('.table__cell_name')
          .dataset.id;
      // dataNew.splice([...document.querySelectorAll('.table__row')]
      //   .indexOf(target.closest('.table__row')), 1);
      await fetchRequest(data + `api/goods/${line}`, {
        method: 'DELETE',
      });
      target.closest('.table__row').remove();

      countRows();
      // totalPrice.textContent = `
      //   $ ${calcTotal(data)}
      // `;
    }
    if (target.matches('.table__btn_pic')) {
      const middleHeight = (screen.height / 2) - (600 / 2);
      const middleWidth = (screen.width / 2) - (800 / 2);

      const path = target.dataset.pic;
      const popup = open('about:blank', '', 'popup', 'width=600, height=600');
      const img = document.createElement('img');
      img.src = path;
      img.style.cssText = `
        display: block;
        width: 100%;
      `;
      popup.document.body.append(img);
      popup.moveTo(middleWidth, middleHeight);
    }
  });
};
