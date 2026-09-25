// Real church payment details. A method stays hidden on the donate page until its value
// is filled in here: never publish placeholders, because donors copy and pay to them.
type DonateConfig = {
  paypalMe: string | null;
  stripePaymentLink: string | null;
  bankMN: { bankName: string; accountNumber: string | null; accountHolder: string };
  bankIntl: {
    beneficiaryName: string;
    bankName: string;
    swift: string;
    iban: string | null;
    bankAddress: string;
  };
  crypto: { usdtTrc20: string | null };
  presetAmountsMNT: readonly number[];
  presetAmountsUSD: readonly number[];
};

export const DONATE_CONFIG: DonateConfig = {
  paypalMe: null,
  stripePaymentLink: null,
  bankMN: {
    bankName: "Хаан Банк",
    accountNumber: null,
    accountHolder: "",
  },
  bankIntl: {
    beneficiaryName: "",
    bankName: "Khan Bank",
    swift: "AGMOMNUB",
    iban: null,
    bankAddress: "Khan Bank Tower, Ulaanbaatar, Mongolia",
  },
  crypto: {
    usdtTrc20: null,
  },
  presetAmountsMNT: [50000, 100000, 500000, 1000000],
  presetAmountsUSD: [25, 50, 100, 250],
};

export const DONATE_METHODS = {
  paypal: Boolean(DONATE_CONFIG.paypalMe),
  card: Boolean(DONATE_CONFIG.stripePaymentLink),
  bankMN: Boolean(DONATE_CONFIG.bankMN.accountNumber && DONATE_CONFIG.bankMN.accountHolder),
  bankIntl: Boolean(DONATE_CONFIG.bankIntl.iban && DONATE_CONFIG.bankIntl.beneficiaryName),
  crypto: Boolean(DONATE_CONFIG.crypto.usdtTrc20),
} as const;
