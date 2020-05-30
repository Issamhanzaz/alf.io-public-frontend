import { SimplePaymentProvider } from '../payment-provider';

export class MultisafepayPaymentProvider extends SimplePaymentProvider {
    get paymentMethodDeferred(): boolean {
        return false;
    }
}
