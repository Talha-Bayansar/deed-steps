import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export const monthPrices = [
  "price_1QqyjYGL1AGFWIgJ5Le6xFn1",
  "price_1Qqyk7GL1AGFWIgJ2UQ6GLFI",
];

export const yearPrices = [
  "price_1Qqyl4GL1AGFWIgJetL5FzXG",
  "price_1QqykjGL1AGFWIgJR1sIG3My",
];

export const basicPrices = [
  "price_1QqyjYGL1AGFWIgJ5Le6xFn1",
  "price_1Qqyl4GL1AGFWIgJetL5FzXG",
];
export const proPrices = [
  "price_1Qqyk7GL1AGFWIgJ2UQ6GLFI",
  "price_1QqykjGL1AGFWIgJR1sIG3My",
];
