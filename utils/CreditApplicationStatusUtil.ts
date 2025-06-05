export enum CreditApplicationStatus {
    Unknown = 0,
    Created = 10,
    ConditionallyApproved = 20,
    ConditionallyDenied = 21,
    CustomerConfirmation = 30,
    CustomerCompletedGuarantorInformation = 31,
    CustomerCompletedFinancialInformation = 32,
    Submitted = 40,
    Approved = 50,
    Denied = 51,
    PendingSignature = 60,
    Originated = 70,
    AbandonedApplication = 80,
    Withdrawn = 81,
    DeclinedProgram = 82,
    Expired = 83,
    AccountClosed = 84
}