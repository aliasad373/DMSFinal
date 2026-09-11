export const mapCardFromApi = (card) => {
  if (!card) return null;

  return {
    id: card.cardId,

    bankId: card.bankId,

    bankName: card.bankName || "",

    type: card.cardType
      ? card.cardType.charAt(0).toUpperCase() +
        card.cardType.slice(1).toLowerCase()
      : "",

    bin: card.cardbin || "",

    // Your backend cardName represents
    // what your frontend calls scheme
    scheme: card.cardName || "",

    category: card.cardCategory
      ? card.cardCategory.charAt(0).toUpperCase() +
        card.cardCategory.slice(1).toLowerCase()
      : "",

    discountPercentage: Number(
      card.discountPercentage || 0
    ),

    capValue: Number(
      card.discountedAmount || 0
    ),

    createdAt: card.createdAt,

    updatedAt: card.updatedAt,
  };
};