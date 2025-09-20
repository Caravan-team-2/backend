export interface initPaymentResponse {
  type: string;
  id: string;
  attributes: {
    amount: string;
    status: string;
    form_url: string;
  };
}
