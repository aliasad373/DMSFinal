import { allCardsMock } from "../data/allCardsMock";
import apiClient from "./apiClient";

let cards = [...allCardsMock];

const delay = (milliseconds = 400) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export const getAllCards = async () => {
  const response = await apiClient.get(
    "/cards/allcards"
  );

  return response.data;
};
//
export const updateAllCard = async (
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
//





export const deleteAllCard = async (
  cardId
) => {
   const response = await apiClient.delete(
    `/cards/delete-card/${cardId}`
  );

  return response.data;
};