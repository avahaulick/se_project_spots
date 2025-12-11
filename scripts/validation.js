const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formEl, inputEl, errorMsg) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = errorMsg;
  inputEl.classList.add("modal__input_type_error");
};

const hideInputError = (formEl, inputEl) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = "";
  inputEl.classList.remove("modal__input_type_error");
};

const checkInputValidity = (formEl, inputEl) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    hideInputError(formEl, inputEl);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonEl, config) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonEl, config);
  } else {
    buttonEl.disabled = false;
    buttonEl.classList.remove(config.inactiveButtonClass);
  }
};

const disableButton = (buttonEl, config) => {
  console.log(config);
  buttonEl.disabled = true;
  buttonEl.classList.add(config.inactiveButtonClass);
};

const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);
  console.log(buttonElement);
  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", function () {
      checkInputValidity(formEl, inputEl);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

function resetValidation(formEl, config) {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonEl = formEl.querySelector(config.submitButtonSelector);

  // Clear each input error
  inputList.forEach((inputEl) => {
    hideInputError(formEl, inputEl); // remove error text + class
  });

  // Disable button (same as when modal first opens)
  disableButton(buttonEl, config);
}

function enableValidation(config) {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
}

enableValidation(settings);
