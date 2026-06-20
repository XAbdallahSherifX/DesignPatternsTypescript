import { PaymentProcessor } from "./payment-processor";
import { CreditCard, DepitCard, Paypal } from "./strategies";

const paymentProcessor = new PaymentProcessor();

const strategy: string = "Depit";

switch (strategy) {
  case "Depit":
    paymentProcessor.setStrategy(new DepitCard());
    break;

  case "Credit":
    paymentProcessor.setStrategy(new CreditCard());
    break;

  case "Paypal":
    paymentProcessor.setStrategy(new Paypal());
    break;
}

paymentProcessor.processPayment(100);
