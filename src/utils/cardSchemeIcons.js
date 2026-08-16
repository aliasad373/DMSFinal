import visaIcon from "../assets/visa.png";
import mastercardIcon from "../assets/mastercard.png";
import paypakIcon from "../assets/paypak.png";
import unionpayIcon from "../assets/unionpay.png";

export const cardSchemeIcons = {
  Visa: visaIcon,
  Mastercard: mastercardIcon,
  PayPak: paypakIcon,
  UnionPay: unionpayIcon,
};

export const getCardSchemeIcon = (scheme) => {
  return cardSchemeIcons[scheme] || null;
};