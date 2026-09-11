import apiClient from "./apiClient";

export const getDiscountedTransactions = async (
  fromDate,
  toDate
) => {
  const response = await apiClient.get(
    "/transactions/discounted-transactions",
    {
      params: {
        fromDate,
        toDate,
      },
    }
  );

  return response.data;
};