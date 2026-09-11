import { initialMerchants } from "../data/merchantsMock";
import apiClient from "./apiClient";

let merchants = [...initialMerchants];

const delay = (milliseconds = 400) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

/*
 * GET ALL MERCHANTS
 */
export const getMerchants = async () => {
  const response = await apiClient.get("/merchants/allmerchants");
  return response.data;
};

/*
 * GET MERCHANT BANKS
 */
export const getMerchantBanks = async (merchantId) => {
  const response = await apiClient.get(
    `/merchants/${merchantId}/banks`
  );

  return response.data;
};

export const updateMerchantBanks = async (
  merchantId,
  bankIds
) => {
  const response = await apiClient.put(
    `/merchants/${merchantId}/banks`,
    {
      bankIds,
    }
  );

  return response.data;
};

/*
 * CREATE MERCHANT
 */
export const createMerchant = async (requestBody) => {
  const response = await apiClient.post("/merchants/register", {
    MID: requestBody.MID,
    TID: requestBody.TID,
    merchantName: requestBody.merchantName,
    bankIds: requestBody.bankIds,
  });

  return response.data;
};

/*
 * UPDATE MERCHANT
 */
export const updateMerchant = async (originalMerchant, requestBody) => {
  const response = await apiClient.put("/merchants/update-merchant", {
    oldMID: originalMerchant.mid,
    oldTID: originalMerchant.tid,

    MID: requestBody.mid,
    TID: requestBody.tid,

    merchantName: requestBody.merchantName,
  });

  return response.data;
};

/*
 * DELETE MERCHANT
 */
export const deleteMerchant = async (merchantId) => {
  const response = await apiClient.delete(
    `/merchants/delete-merchant/${merchantId}`,
  );

  return response.data;
};
