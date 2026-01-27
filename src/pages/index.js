import { enableValidation } from "../scripts/validation.js";
import Api from "../util/Api.js";
import "../vendor/normalize.css";
import "../vendor/fonts.css";
import "../pages/index.css";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "e6f9c542-96e2-4dff-be47-54fa70bb6f09",
    "Content-Type": "application/json",
  },
});

const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

enableValidation(validationConfig);

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const newPostBtn = document.querySelector(".profile__add-btn");
const avatarBtn = document.querySelector(".profile__avatar-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");
const imageCaptionInput = newPostModal.querySelector("#image-caption-input");
const cardImageInput = newPostModal.querySelector("#card-image-input");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteCancelBtn = deleteModal.querySelector(
  ".modal__submit-btn_type_cancel",
);

// Variables to store the current selected card and its ID
let selectedCard;
let selectedCardId;

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");
const cardContentEl = document.querySelector(".card__image");
const cardTitleEl = document.querySelector(".card__title");

// Get submit buttons for loading states
const editProfileSubmitBtn =
  editProfileForm.querySelector(".modal__submit-btn");
const newPostSubmitBtn = newPostForm.querySelector(".modal__submit-btn");
const avatarSubmitBtn = avatarForm.querySelector(".modal__submit-btn");
const deleteSubmitBtn = deleteForm.querySelector(
  ".modal__submit-btn_type_delete",
);

// Helper function to render loading state
function renderLoading(button, isLoading, loadingText = "Saving...") {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    // Restore original text based on button type
    if (button === editProfileSubmitBtn) {
      button.textContent = "Save";
    } else if (button === newPostSubmitBtn) {
      button.textContent = "Save";
    } else if (button === avatarSubmitBtn) {
      button.textContent = "Save";
    } else if (button === deleteSubmitBtn) {
      button.textContent = "Delete";
    }
  }
}

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", () => {
    const isLiked = cardLikeBtnEl.classList.contains("card__like-btn_active");
    const likeAction = isLiked
      ? api.unlikeCard(data._id)
      : api.likeCard(data._id);

    likeAction
      .then(() => {
        cardLikeBtnEl.classList.toggle("card__like-btn_active");
      })
      .catch(console.error);
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", () => {
    handleDeleteCard(cardElement, data);
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewCaptionEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  renderLoading(editProfileSubmitBtn, true);
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((userData) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(editProfileSubmitBtn, false);
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  renderLoading(newPostSubmitBtn, true);

  const inputValues = {
    name: imageCaptionInput.value,
    link: cardImageInput.value,
  };

  api
    .addCard(inputValues)
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      closeModal(newPostModal);
      newPostForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(newPostSubmitBtn, false);
    });
}

avatarBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

avatarCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  renderLoading(avatarSubmitBtn, true);
  api
    .updateAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatarEl.src = userData.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(avatarSubmitBtn, false);
    });
}

avatarForm.addEventListener("submit", handleAvatarSubmit);

// Handler for delete card button click
function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

deleteCloseBtn.addEventListener("click", function () {
  closeModal(deleteModal);
  selectedCard = null;
  selectedCardId = null;
});

deleteCancelBtn.addEventListener("click", function () {
  closeModal(deleteModal);
  selectedCard = null;
  selectedCardId = null;
});

// Handler for delete confirmation submission
function handleDeleteSubmit(evt) {
  evt.preventDefault();
  renderLoading(deleteSubmitBtn, true, "Deleting...");
  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
      selectedCard = null;
      selectedCardId = null;
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(deleteSubmitBtn, false);
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

newPostForm.addEventListener("submit", handleAddCardSubmit);

initialCards.forEach(function (item) {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});
