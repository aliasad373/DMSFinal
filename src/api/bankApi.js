import { initialBanks } from "../data/banksMock";

import apiClient from "./apiClient";

let mockBanks = [...initialBanks];

const simulateDelay = (milliseconds = 500) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export const getBanks = async () => {
  //await simulateDelay();
     const response = await apiClient.get("/banks/allbanks");

     console.log("Banks API response:", response.data);

     return response.data;
  
};

export const createBank = async (requestBody) => {
  await simulateDelay();

  const response = await apiClient.post(
    "/banks/register",
    {
      bankName: requestBody.name,
    }
  );

  return response.data;
};

export const updateBank = async (
  bankId,
  requestBody
) => {
   const response = await apiClient.put(
    `/banks/update-bank/${bankId}`,
    {
      bankName: requestBody.name,
    }
  );

  return response.data;
};

export const deleteBank = async (bankId) => {
 const response = await apiClient.delete(
    `/banks/delete-bank/${bankId}`
  );

  return response.data;
};