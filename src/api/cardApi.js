import { initialCards } from "../data/cardsMock";

import apiClient from "./apiClient";

let mockCards = [...initialCards];

const delay = (milliseconds = 400) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

/**
 * GET CARDS BY BANK
 */
export const getCardsByBank = async (bankId) => {
  const response = await apiClient.get(
    `/banks/bank-cards/${bankId}`
  );
  console.log(response)
  return response.data;
};

/**
 * CREATE CARD
 */
export const createCard = async (
  bankId,
  requestBody
) => {
  const response = await apiClient.post(
    "/cards/register",
    {
      bankId: Number(bankId),

      cardbin: requestBody.bin,

      cardName: requestBody.scheme,

      cardType: requestBody.type,

      cardCategory:
        requestBody.categoryType ||
        requestBody.category,

      discountPercentage: Number(
        requestBody.discountPercentage
      ),

      discountedAmount: Number(
        requestBody.capValue
      ),
    }
  );

  return response.data;
};

/**
 * UPDATE CARD
 */
export const updateCard = async (
  cardId,
  bankId,
  requestBody
) => {
  const response = await apiClient.put(
    `/cards/update-card/${cardId}`,
    {
      bankId: Number(bankId),

      cardbin: requestBody.bin,

      cardName: requestBody.scheme,

      cardType:
        requestBody.type?.toUpperCase(),

      cardCategory:
        requestBody.category?.toUpperCase(),

      discountPercentage: Number(
        requestBody.discountPercentage
      ),

      discountedAmount: Number(
        requestBody.capValue
      ),
    }
  );

  return response.data;
};

/**
 * DELETE CARD
 */
export const deleteCard = async (cardId) => {
  const response = await apiClient.delete(
    `/cards/delete-card/${cardId}`
  );

  return response.data;
};