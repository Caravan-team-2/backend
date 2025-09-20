export interface EmailReceiptResponse {
  data: {
    type: string;
    id: string;
    attributes: {
      order_number: string;
      email: string;
      status: string;
    };
  };
}
