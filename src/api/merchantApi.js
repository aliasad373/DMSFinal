import { initialMerchants } from "../data/merchantsMock";

let merchants = [...initialMerchants];

const delay = (milliseconds = 400) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

/*
 * GET ALL MERCHANTS
 */
export const getMerchants = async () => {
  await delay();

  return {
    success: true,
    message: "Merchants fetched successfully.",
    data: [...merchants],
  };
};

/*
 * CREATE MERCHANT
 */
export const createMerchant = async (requestBody) => {
  await delay();

  const mid = requestBody.mid.trim();
  const tid = requestBody.tid.trim();

  const duplicateMID = merchants.some(
    (merchant) =>
      merchant.mid.toLowerCase() === mid.toLowerCase()
  );

  if (duplicateMID) {
    throw new Error("This MID already exists.");
  }

  const duplicateTID = merchants.some(
    (merchant) =>
      merchant.tid.toLowerCase() === tid.toLowerCase()
  );

  if (duplicateTID) {
    throw new Error("This TID already exists.");
  }

  const newMerchant = {
    id:
      merchants.length > 0
        ? Math.max(...merchants.map((merchant) => merchant.id)) + 1
        : 1,

    mid,
    tid,

    /*
     * Newly created merchants
     * are active by default.
     */
    status: "Active",

    createdAt: new Date().toISOString(),
  };

  merchants = [
    newMerchant,
    ...merchants,
  ];

  return {
    success: true,
    message: "Merchant created successfully.",
    data: newMerchant,
  };
};

/*
 * UPDATE MERCHANT
 */
export const updateMerchant = async (
  merchantId,
  requestBody
) => {
  await delay();

  const numericId = Number(merchantId);

  const index = merchants.findIndex(
    (merchant) =>
      merchant.id === numericId
  );

  if (index === -1) {
    throw new Error("Merchant not found.");
  }

  const mid = requestBody.mid.trim();
  const tid = requestBody.tid.trim();

  const duplicateMID = merchants.some(
    (merchant) =>
      merchant.id !== numericId &&
      merchant.mid.toLowerCase() === mid.toLowerCase()
  );

  if (duplicateMID) {
    throw new Error("This MID already exists.");
  }

  const duplicateTID = merchants.some(
    (merchant) =>
      merchant.id !== numericId &&
      merchant.tid.toLowerCase() === tid.toLowerCase()
  );

  if (duplicateTID) {
    throw new Error("This TID already exists.");
  }

  merchants[index] = {
    ...merchants[index],
    mid,
    tid,
  };

  return {
    success: true,
    message: "Merchant updated successfully.",
    data: merchants[index],
  };
};

/*
 * DELETE MERCHANT
 */
export const deleteMerchant = async (
  merchantId
) => {
  await delay();

  const numericId = Number(merchantId);

  const exists = merchants.some(
    (merchant) =>
      merchant.id === numericId
  );

  if (!exists) {
    throw new Error("Merchant not found.");
  }

  merchants = merchants.filter(
    (merchant) =>
      merchant.id !== numericId
  );

  return {
    success: true,
    message: "Merchant deleted successfully.",
  };
};