import { allCardsMock } from "../data/allCardsMock";

let cards = [...allCardsMock];

const delay = (milliseconds = 400) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export const getAllCards = async () => {
  await delay();

  return {
    success: true,
    message: "Cards fetched successfully.",
    data: [...cards],
  };
};

export const updateAllCard = async (
  cardId,
  requestBody
) => {
  await delay();

  const numericCardId = Number(cardId);

  const cardIndex = cards.findIndex(
    (card) => card.id === numericCardId
  );

  if (cardIndex === -1) {
    throw new Error("Card not found.");
  }

  cards[cardIndex] = {
    ...cards[cardIndex],

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

  return {
    success: true,
    message: "Card updated successfully.",
    data: cards[cardIndex],
  };
};

export const deleteAllCard = async (
  cardId
) => {
  await delay();

  const numericCardId = Number(cardId);

  const exists = cards.some(
    (card) => card.id === numericCardId
  );

  if (!exists) {
    throw new Error("Card not found.");
  }

  cards = cards.filter(
    (card) => card.id !== numericCardId
  );

  return {
    success: true,
    message: "Card deleted successfully.",
  };
};