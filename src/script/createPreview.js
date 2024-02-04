import {createElement} from './createElems';

const createPreview = file => {
  const isFile = typeof file === 'string' ? file : URL.createObjectURL(file);
  const wrap = createElement('div',
    {
      className: 'preview',
    });

  const wrapImg = new Image();
  wrapImg.classList.add('preview__img');
  wrapImg.src = isFile;

  const overlay = createElement('div', {
    className: 'preview__overlay',
    style: `
      transition: all 0.5s ease-out;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      transform: translateX(100%);
    `,
  },
  {
    append: createElement('button', {
      type: 'button',
      className: 'preview__icon preview__close',
      style: `
        width: 40px;
        height: 40px;
      `,
    }),
  });

  wrap.append(wrapImg, overlay);

  return wrap;
};

export default createPreview;
