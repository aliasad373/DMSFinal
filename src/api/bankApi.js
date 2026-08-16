import { initialBanks } from "../data/banksMock";

let mockBanks = [...initialBanks];

const simulateDelay = (milliseconds = 500) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export const getBanks = async () => {
  await simulateDelay();

  return {
    success: true,
    message: "Banks fetched successfully.",
    data: [...mockBanks],
  };
};

export const createBank = async (requestBody) => {
  await simulateDelay();

  const bankName = requestBody.name.trim();

  const alreadyExists = mockBanks.some(
    (bank) =>
      bank.name.toLowerCase() === bankName.toLowerCase()
  );

  if (alreadyExists) {
    throw new Error("A bank with this name already exists.");
  }

  const newBank = {
    id:
      mockBanks.length > 0
        ? Math.max(...mockBanks.map((bank) => bank.id)) + 1
        : 1,

    name: bankName,

    // Later backend will provide this.
    iconUrl: "",
  };

  mockBanks = [newBank, ...mockBanks];

  return {
    success: true,
    message: "Bank added successfully.",
    data: newBank,
  };
};

export const updateBank = async (
  bankId,
  requestBody
) => {
  await simulateDelay();

  const bankName = requestBody.name.trim();

  const bankIndex = mockBanks.findIndex(
    (bank) => bank.id === bankId
  );

  if (bankIndex === -1) {
    throw new Error("Bank not found.");
  }

  const duplicateBank = mockBanks.some(
    (bank) =>
      bank.id !== bankId &&
      bank.name.toLowerCase() === bankName.toLowerCase()
  );

  if (duplicateBank) {
    throw new Error("A bank with this name already exists.");
  }

  mockBanks[bankIndex] = {
    ...mockBanks[bankIndex],
    name: bankName,
  };

  return {
    success: true,
    message: "Bank updated successfully.",
    data: mockBanks[bankIndex],
  };
};

export const deleteBank = async (bankId) => {
  await simulateDelay();

  const bankExists = mockBanks.some(
    (bank) => bank.id === bankId
  );

  if (!bankExists) {
    throw new Error("Bank not found.");
  }

  mockBanks = mockBanks.filter(
    (bank) => bank.id !== bankId
  );

  return {
    success: true,
    message: "Bank deleted successfully.",
  };
};