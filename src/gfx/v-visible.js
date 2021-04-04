const vVisible = {
  install(Vue) {
    Vue.directive('visible', (el, binding) => {
      const { value } = binding;
      if (value) {
        // eslint-disable-next-line no-param-reassign
        el.style.visibility = 'visible';
      } else {
        // eslint-disable-next-line no-param-reassign
        el.style.visibility = 'hidden';
      }
    });
  },
};

export default vVisible;
