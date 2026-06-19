import { Customer } from "./customer";
import { GoldenPhone, Phone, SilverPhone } from "./phone";

const customer = new Customer("Abdallah", 2000);

const phone = new Phone("Samsung", 1000);
const goldenPhone = new GoldenPhone(phone);
const silverPhone = new SilverPhone(phone);

customer.buyPhone(goldenPhone);
