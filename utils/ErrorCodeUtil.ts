// ErrorCode.ts

export enum ErrorCode {
    Unknown = 0,
    AccountNotFound = 1,
    DuplicateFound = 2,
    BusinessRuleTypeUnknown = 3,
    BusinessRuleNotFound = 4,
    AccountLockout = 5,
  
    // Registrar / Hospital Errors
    EmptyPatientSearch = 100,
    NoRegistrarPermissions = 101,
    NoRegistrarPermissionsForHospital = 102,
    PatientEpisodeAlreadyUtilized = 103,
    InvalidHospital = 104,
    PatientEpisodeNotFound = 105,
    FundingSourceNotFound = 106,
    FundingSourceNotAuthorized = 107,
    ExistingCreditApplicationFound = 108,
    InvalidDepartmentId = 109,
    DuplicateSsnOrEmailFound = 110,
    AdvanceRequestExistingPendingTransactionFound = 111,
    NoApplicationFound = 112,
  
    // Postbilling Pre-Qualification Errors
    StatementAlreadyFinanced = 200,
    StatementNotFound = 201,
    DuplicateEmailFound = 203,
    DuplicateSsnFound = 204,
    FailedConditionalUnderwriting = 205,
    StatementSearchReturnedMultiplePatients = 206,
    StatementSearchReturnedMultipleGuarantor = 207,
  
    // Account Registration Errors
    SumOfEpisodesMoreThanApprovedAmount = 300,
    InvalidApplicationStatus = 301,
    LmsDocumentSigningError = 302,
    LmsOriginationError = 303,
    InvalidPassword = 304,
    InvalidEmail = 305,
    InvalidPaymentMethod = 306,
    InvalidPaymentSchedule = 307,
    RecurringPaymentAccountEstablished = 308,
    InvalidPhone = 309,
  
    // Payment Errors
    PaymentAmountMustBePositive = 500,
    PaymentMustNotExceedLoanBalance = 501,
    ScheduledPaymentMustOccurBeforeNextDueDate = 502,
    DebitFailedVerificationDuringPayment = 503,
    AchFailedVerificationDuringPayment = 504,
    InvalidSavedPaymentInformationDuringPayment = 505,
    PaymentNotAllowedWhileAdjustmentsAreOutstanding = 506,
    OnlyOneScheduledPaymentAllowed = 507,
    OnlyOneImmediatePaymentAllowed = 508,
    PaymentMustBeBeforeOrAfterAutoPayDate = 509,
    AchPaymentCannotBeOnDayBeforeAutoPayDate = 510,
    PaymentAmountMustNotBeNegative = 511,
    RepayPaymentError = 512,
    TransactionNotFound = 513,
    TransactionAlreadyProcessed = 514,
    InvalidTransactionStatus = 515,
    InvalidPaymentChannel = 516,
  
    // Admin Balance Adjustment
    BalanceAdjustmentAlreadyConfirmed = 700,
    BalanceAdjustmentNotFound = 701,
    BalanceAdjustmentPatientEpisodeNotFound = 702,
    BalanceAdjustmentCreditAccountNotActive = 703,
    BalanceAdjustmentAdvanceTransactionNotFound = 704,
    BalanceAdjustmentAdvanceTransactionNotExecuted = 705,
    BalanceAdjustmentPatientEpisodeAlreadyHasActiveAdjustment = 706,
    BalanceAdjustmentMustHaveNonZeroAmount = 707,
    BalanceAdjustmentActiveUpwardTransactionExists = 708,
    BalanceAdjustmentAccountInBadStanding = 709,
  
    // Admin Discharging
    FutureDischargeDateRequested = 720,
    MultiplePatientEpisodesFoundDischargeRequest = 721,
    NoPatientEpisodesFoundDischargeRequest = 722,
    NeedPayorClass = 723,
    HasPayorClass = 724,
  
    // Admin Payment
    AdminPaymentMethodVerificationFailed = 730,
    AdminPaymentAmountInvalid = 731,
    AdminPaymentScheduleInvalid = 732,
  
    // Scoring Errors
    HospitalScoringConfigurationNotFound = 1000,
    InvalidHospitalScoringGrade = 1001,
    CustomerDateOfBirthNotFoundDuringScoring = 1002,
    CustomerGrossAnnualIncomeNotFoundDuringScoring = 1003,
    PatientEpisodeFinalAmountNotFoundDuringScoring = 1004,
    ScoreUnableToBeCalculated = 1005,
  
    // MyPlan Errors
    NegativeRemainingBalance = 1100,
    PatientResponsibilityMustBePositive = 1105,
    NumberOfPaymentsMustBePositive = 1106,
    InvalidPaymentDate = 1107,
    ScheduledPaymentCountMismatch = 1108,
    ScheduledPaymentTotalMismatch = 1109,
    PaymentDatePreviouslyUpdated = 1110,
    ProviderNotConfigured = 1111,
    ProviderAlreadyConfigured = 1112,
    AccountHasActiveDeclinedTransactions = 1113,
    PaymentsCancelled = 1116,
  
    // Customer Payment
    CustomerMaxMethodAdded = 733,
  }
  