import {openModal} from './modal';
import fetchRequest from './networking/fetchRequest';
import {calcTotal, countRows, getId} from './utility';

export const rowControl = async (data, selector, overlay, add, totalPrice) => {
  const dataNew = await fetchRequest(data + 'api/goods', {
    method: 'get',
  }).then(data => console.log(data));
  selector.addEventListener('click', ev => {
    const target = ev.target;

    if (target === add) {
      overlay.querySelector('.vendor-code__id').textContent = getId();
      openModal(overlay);
    }
    if (target.matches('.table__btn_del')) {
      dataNew.splice([...document.querySelectorAll('.table__row')]
        .indexOf(target.closest('.table__row')), 1);

      target.closest('.table__row').remove();

      countRows();
      totalPrice.textContent = `
        $ ${calcTotal(data)}
      `;
    }
    if (target.matches('.table__btn_pic')) {
      const middleHeight = (screen.height / 2) - (600 / 2);
      const middleWidth = (screen.width / 2) - (800 / 2);

      const path = target.dataset.pic;
      const popup = open('about:blank', '', 'popup', 'width=800', 'height=600');
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
