import { describe, it, expect } from "vitest";
import { buildPaymentDeepLink, PAYMENT_APPS_BY_REGION } from "./deep-links";

describe("buildPaymentDeepLink", () => {
  it("builds a Raast link (PK)", () => {
    expect(buildPaymentDeepLink({ method: "raast", receiver: "+923001234567", amount: 1500 })).toBe(
      "raast://pay?receiver=%2B923001234567&amount=1500"
    );
  });

  it("builds a JazzCash link (PK)", () => {
    const link = buildPaymentDeepLink({
      method: "jazzcash",
      receiver: "+923001234567",
      amount: 450,
    });
    expect(link.startsWith("jazzcash://pay?receiver=%2B923001234567&amount=450")).toBe(true);
  });

  it("builds an Easypaisa link (PK)", () => {
    const link = buildPaymentDeepLink({
      method: "easypaisa",
      receiver: "+923001234567",
      amount: 250,
    });
    expect(link.startsWith("easypaisa://pay?")).toBe(true);
  });

  it("builds a UPI link (IN) with pa, am, cu params", () => {
    const link = buildPaymentDeepLink({
      method: "upi",
      receiver: "ali@okhdfc",
      amount: 1100,
      note: "Chai Gang",
    });
    expect(link).toContain("upi://pay?pa=ali%40okhdfc&am=1100&cu=INR");
    expect(link).toContain("tn=Chai%20Gang");
  });

  it("encodes special characters in receiver", () => {
    const link = buildPaymentDeepLink({ method: "upi", receiver: "a b@okhdfc", amount: 10 });
    expect(link).toContain("pa=a%20b%40okhdfc");
  });
});

describe("PAYMENT_APPS_BY_REGION", () => {
  it("offers JazzCash/Easypaisa/Raast in PK", () => {
    expect(PAYMENT_APPS_BY_REGION.PK.map((a) => a.id)).toEqual(["jazzcash", "easypaisa", "raast"]);
  });

  it("offers UPI in IN", () => {
    expect(PAYMENT_APPS_BY_REGION.IN.map((a) => a.id)).toEqual(["upi"]);
  });
});
