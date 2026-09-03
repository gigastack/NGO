import { describe, it, expect } from "bun:test";
import { NgnAccountSchema, DomiciliaryAccountSchema, DonationTierSchema, BankingSchema } from "../src/lib/schema/ngo.schema";
import bankingJson from "../content/banking.json";

describe("Donation Data & Flow Contracts", () => {
  it("validates banking.json content against BankingSchema", () => {
    const parsed = BankingSchema.safeParse(bankingJson);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.ngnAccount.bankName).toBe("Guaranty Trust Bank (GTBank)");
      expect(parsed.data.ngnAccount.accountNumber).toBe("0123456789");
      expect(parsed.data.domiciliaryAccounts.length).toBe(3);
      expect(parsed.data.donationTiers.length).toBe(4);
    }
  });

  it("formats WhatsApp URL correctly", () => {
    const phone = bankingJson.ngnAccount.whatsappConfirmationPhone;
    const rawPhone = phone.replace(/[^0-9]/g, "");
    expect(rawPhone).toBe("2348039001234");

    const amountFormatted = "₦5,000";
    const tier = bankingJson.donationTiers[0];
    const text = `Hello Abuja Resilience Initiative, I have completed a bank transfer donation of ${amountFormatted} for the "${tier.label}" tier (${tier.impactDescription}). Please find my transfer receipt attached for confirmation.`;
    const url = `https://wa.me/${rawPhone}?text=${encodeURIComponent(text)}`;

    expect(url.startsWith("https://wa.me/2348039001234?text=")).toBe(true);
    expect(url.includes("Grassroots%20Seedling")).toBe(true);
  });
});
