const createPreview = file => {
  const wrap = document.createElement('div');
  wrap.classList.add('preview');

  const wrapImg = new Image();
  wrapImg.classList.add('preview__img');
  wrapImg.src = URL.createObjectURL(file);

  wrap.append(wrapImg);

  return wrap;
};

export default createPreview;
