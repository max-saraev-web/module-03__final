import {createCategoryList, createElement} from './createElems';
import createPreview from './createPreview';
import {openModal} from './modal';
import fetchRequest from './networking/fetchRequest';
import {countRows, generateTotalPages, getId, pagesFractions} from './utility';

export const rowControl = async (
    data,
    selector,
    overlay,
    add,
    totalPrice,
    elems,
) => {
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
      const totalOutput = overlay.querySelector('.modal__total-price');
      // ! - компонент 1
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
      // ! - компонент 2
      const finalPrice = obj => {
        const {price, count, discount} = obj;

        const dicountAmount = ((price * count) / 100) * discount;
        if (discount) {
          return (price * count) - dicountAmount;
        } else {
          return price * count;
        }
      };

      const line =
        target
          .parentElement
          .parentElement.querySelector('.table__cell_name')
          .dataset.id;
      overlay.querySelector('.vendor-code__id').textContent = line;
      overlay.querySelector('.modal__title').textContent = 'Изменить ТОВАР';

      const imgUrl =
        target?.parentElement.querySelector('.table__btn_pic').dataset.pic;

      const previewImg = createPreview(imgUrl);
      const fieldSet = document.querySelector('.modal__fieldset');

      if (/(\d+)\.(webp|jpg|jpeg|png|svg|gif)$/
        .test(imgUrl)) {
        new Promise(resolve => {
          const img = createElement('img');
          img.src = imgUrl;
          img.addEventListener('load', () => {
            resolve();
          });
        }).then(() => {
          fieldSet.append(previewImg);
          const previewClose = document.querySelector('.preview__close');
          previewClose.addEventListener('click', () => {
            previewImg.remove();
          });
        });
      }

      const label = overlay.querySelector('.modal__label_category');
      label.append(categories);

      const goodData = await fetchRequest(data + `api/goods/${line}`, {
        method: 'get',
      });

      const reverseDiscount = (discountedPrice, discount) =>
        discountedPrice / (1 - discount / 100);

      let fixedOutput = NaN;
      if (goodData.discount > 0) {
        fixedOutput = reverseDiscount(goodData.price, goodData.discount);
      }


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
      price.value = `${fixedOutput > 0 ? fixedOutput : goodData.price}`;

      priceData.price = fixedOutput > 0 ? fixedOutput : goodData.price;
      priceData.count = goodData.count;

      if (goodData.discount) {
        discount.checked = true;
        discontCountField.value = `${goodData.discount}`;
        priceData.discount = goodData.discount;
      } else {
        discount.checked = false;
        discontCountField.value = '';
        discontCountField.disabled;
      }
      totalOutput.textContent = `$ ${finalPrice(priceData)}`;
      openModal(overlay);
    }

    if (target === add) {
      overlay.querySelector('.modal__title').textContent = 'Добавить ТОВАР';

      const preview = overlay.querySelector('.preview');
      if (preview) preview.remove();

      overlay.querySelector('.vendor-code__id').textContent = getId();
      const label = overlay.querySelector('.modal__label_category');
      label.append(categories);
      const previewElem = document.querySelector('.preview');
      if (previewElem) previewElem.remove();

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
      }).then(async () => {
        const select = document.querySelector('select');
        select.innerHTML = '';
        const pages = await fetchRequest(data + `api/goods`, {
          method: 'GET',
        });
        const {totalCount, goods} = pages;
        const {total: totalInpage, currentGoods} = elems();
        const output = pagesFractions(totalCount);
        const [start, end] = output[1];
        currentGoods.textContent = `${start} - ${end}`;
        totalInpage.textContent = totalCount;
        select.append(...generateTotalPages(goods));

        const total = await fetchRequest(data + 'api/total', {
          method: 'get',
        });
        totalPrice.textContent = `
        $ ${total}
      `;
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
