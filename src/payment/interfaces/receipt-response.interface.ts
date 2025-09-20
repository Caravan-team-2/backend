export interface ReceiptResponse {
  data: {
    type: string;
    id: string;
    attributes: {
      amount: string;
      order_number: string;
      receipt_url: string;
    };
  };
}
