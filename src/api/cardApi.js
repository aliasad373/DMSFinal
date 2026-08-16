import { initialCards } from "../data/cardsMock";

let mockCards = [...initialCards];

const delay = (milliseconds = 400) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

/**
 * GET CARDS BY BANK
 */
export const getCardsByBank = async (bankId) => {
  await delay();

  const numericBankId = Number(bankId);

  return {
    success: true,
    message: "Cards fetched successfully.",
    data: mockCards.filter(
      (card) => card.bankId === numericBankId
    ),
  };
};

/**
 * CREATE CARD
 */
export const createCard = async (
  bankId,
  requestBody
) => {
  await delay();

  const newCard = {
    id:
      mockCards.length > 0
        ? Math.max(
            ...mockCards.map((card) => card.id)
          ) + 1
        : 1,

    bankId: Number(bankId),

    type: requestBody.type,

    scheme: requestBody.scheme,

    bin: requestBody.bin,

    category: requestBody.category,

    categoryType:
      requestBody.categoryType ||
      requestBody.category,

    customCategory:
      requestBody.customCategory || "",

    discountPercentage: Number(
      requestBody.discountPercentage
    ),

    capValue: Number(
      requestBody.capValue
    ),
  };

  mockCards.push(newCard);

  return {
    success: true,
    message: "Card added successfully.",
    data: newCard,
  };
};

/**
 * UPDATE CARD
 */
export const updateCard = async (
  cardId,
  requestBody
) => {
  await delay();

  const numericCardId = Number(cardId);

  const cardIndex = mockCards.findIndex(
    (card) => card.id === numericCardId
  );

  if (cardIndex === -1) {
    throw new Error("Card not found.");
  }

  const existingCard = mockCards[cardIndex];

  const updatedCard = {
    ...existingCard,

    type: requestBody.type,

    scheme: requestBody.scheme,

    category: requestBody.category,

    categoryType:
      requestBody.categoryType ||
      requestBody.category,

    customCategory:
      requestBody.customCategory || "",

    discountPercentage: Number(
      requestBody.discountPercentage
    ),

    capValue: Number(
      requestBody.capValue
    ),
  };

  mockCards[cardIndex] = updatedCard;

  return {
    success: true,
    message: "Card updated successfully.",
    data: updatedCard,
  };
};

/**
 * DELETE CARD
 */
export const deleteCard = async (cardId) => {
  await delay();

  const numericCardId = Number(cardId);

  const cardExists = mockCards.some(
    (card) => card.id === numericCardId
  );

  if (!cardExists) {
    throw new Error("Card not found.");
  }

  mockCards = mockCards.filter(
    (card) => card.id !== numericCardId
  );

  return {
    success: true,
    message: "Card deleted successfully.",
  };
};