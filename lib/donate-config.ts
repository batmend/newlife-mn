// Centralized donation configuration.
// Replace the placeholder values with the real church accounts/links when ready.

export const DONATE_CONFIG = {
  paypalMe: "https://paypal.me/newlifechurch",
  stripePaymentLink: "https://buy.stripe.com/REPLACE_ME",
  bankMN: {
    bankName: "Хаан Банк",
    accountNumber: "5XXX XXXX XXX",
    accountHolder: "Шинэ Амь Христийн Чуулган ТББ",
  },
  bankIntl: {
    beneficiaryName: "New Life Christian Church NGO",
    bankName: "Khan Bank",
    swift: "AGMOMNUB",
    iban: "5XXX XXXX XXX",
    bankAddress: "Khan Bank Tower, Ulaanbaatar, Mongolia",
  },
  crypto: {
    usdtTrc20: "TXX...XXX",
  },
  presetAmountsMNT: [50000, 100000, 500000, 1000000],
  presetAmountsUSD: [25, 50, 100, 250],
} as const;
