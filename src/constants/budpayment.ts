interface initiateBudPayInterface {
  amount: number;
  email: string;
  currency: "NGN";
}

export async function initiateBudPay({
  email,
  amount,
  currency = "NGN" as const,
}: initiateBudPayInterface) {
  if (!email || !amount) {
    console.log("invalid params");
    return;
  }
  try {
  } catch (error) {
    console.log(error);
  }
}
