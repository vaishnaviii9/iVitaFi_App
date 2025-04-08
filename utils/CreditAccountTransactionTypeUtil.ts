export enum CreditAccountTransactionType {
  Unknown = 0,
  PaymentReversal = 22,
  AchPaymentReturn = 26,
  FundingReversal = 43,
  CustomerRefund = 50,
  AchNonDirectedPayment = 211,
  CheckPayment = 215,
  CardPayment = 216,
  MoneyOrderPayment = 217,
  ProcedureDischarge = 402,
  SubsequentProcedureDischarge = 404,
  LoanFunded = 405,
  UpwardAdjustment = 481,
  DownwardAdjustment = 491,
  SettlementBalancePaid = 219,
  ThirdPartyPayments = 291,
  All = 9999,
}

export class CreditAccountTransactionTypeUtil {
  public static toString(type: number): string {
      switch (type) {
          case CreditAccountTransactionType.CustomerRefund:
              return 'Customer Refund';
          case CreditAccountTransactionType.PaymentReversal:
              return 'Payment Reversal';
          case CreditAccountTransactionType.AchPaymentReturn:
              return 'ACH Payment Return';
          case CreditAccountTransactionType.FundingReversal:
              return 'Funding Reversal';
          case CreditAccountTransactionType.AchNonDirectedPayment:
              return 'Bank Account';
          case CreditAccountTransactionType.CheckPayment:
              return 'Check Payment';
          case CreditAccountTransactionType.CardPayment:
              return 'Debit Card';
          case CreditAccountTransactionType.MoneyOrderPayment:
              return 'Money Order Payment';
          case CreditAccountTransactionType.ProcedureDischarge:
              return 'Procedure Discharge';
          case CreditAccountTransactionType.SubsequentProcedureDischarge:
              return 'Subsequent Procedure Discharge';
          case CreditAccountTransactionType.LoanFunded:
              return 'Loan Funded';
          case CreditAccountTransactionType.UpwardAdjustment:
              return 'Upward Adjustment';
          case CreditAccountTransactionType.DownwardAdjustment:
              return 'Downward Adjustment';
          case CreditAccountTransactionType.SettlementBalancePaid:
              return 'Settlement Balance Paid';
          case CreditAccountTransactionType.ThirdPartyPayments:
              return 'Third Party Payment';
          case CreditAccountTransactionType.All:
              return 'All';
          default:
              return 'Unknown';
      }
  }
}
