const swal = require('sweetalert');

export const diceyDialog =  (options = { icon: "info",
  handleDismiss : undefined, handleSecondaryButton : undefined, handlePrimaryButton : undefined}) => {
  //"warning", "error", "success" and "info".
  swal({
    title: null,
    text: "",
    // timer: 6000,
    timerProgressBar: false,
    // buttons: null, //buttons: ["Oh noez!", "Aww yiss!"],
    closeOnEsc: false,
    closeOnClickOutside: false,

    ...options
  })
    .then((value) => {
      if (value === true) {
        options.handlePrimaryButton && options.handlePrimaryButton(value)
      }

      if (value === false) {
        options.handleSecondaryButton && options.handleSecondaryButton(value)
      }
      if (value === null) {
        options.handleDismiss && options.handleDismiss(value)
      }
    });
}

export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}
