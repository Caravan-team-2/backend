export interface PaymentDetails{
  data: {
    type: string;
    id: string;
    attributes: {
      amount: string;
      order_number: string;
      order_id: string;
      status: string;
      form_url: string;
      confirmation_status: string;
      updated_at: string;
    };
  };
}
