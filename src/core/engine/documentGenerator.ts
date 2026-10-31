import { Transaction, CancellationDraft, DisputeDraft } from './types';
import { calculateAnnualCost } from './savingsCalculator';

/**
 * Generates an FTC & CCPA compliant subscription cancellation notice.
 */
export function generateCancellationEmail(tx: Transaction): CancellationDraft {
  const annual = calculateAnnualCost(tx.amount, tx.frequency);
  const subject = `URGENT: Request for Immediate Account & Subscription Termination - [Your Account Name]`;
  
  const body = `To: Billing & Support Department (${tx.merchant})
Subject: ${subject}
Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Dear ${tx.merchant} Billing Team,

Please accept this formal written notice to immediately CANCEL and TERMINATE my recurring subscription and any associated recurring billing profiles for the following service:

- Service Name: ${tx.merchant}
- Recurring Amount: ₹${tx.amount.toFixed(2)} (${tx.frequency})
- Identified Billing Date: ${tx.date}

In accordance with the Federal Trade Commission's (FTC) "Click-to-Cancel" rule and applicable state automatic renewal laws (including California Business and Professions Code § 17600 et seq.), I request that:
1. All recurring billing authorizations on my credit card or bank account be terminated immediately.
2. Written confirmation of this cancellation and effective end date be sent to my email address within 3 business days.
3. No further renewal charges or penalties be levied against my payment methods.

If your system requires me to verify my identity or confirm through an online portal, please direct me to the exact self-service cancellation link immediately.

Thank you for your prompt attention to this matter.

Sincerely,
[Your Full Name]
[Associated Email Address]
[Last 4 Digits of Card: XXXX]`;

  return {
    transactionId: tx.id,
    merchant: tx.merchant,
    amount: tx.amount,
    frequency: tx.frequency,
    annualCost: Math.round(annual * 100) / 100,
    supportEmail: tx.supportEmail || `support@${tx.merchant.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    portalUrl: tx.portalUrl,
    emailSubject: subject,
    emailBody: body,
  };
}

/**
 * Generates a formal Fair Credit Billing Act (FCBA) transaction dispute / chargeback letter.
 */
export function generateDisputeLetter(tx: Transaction): DisputeDraft {
  const isDuplicate = tx.anomalyType === 'duplicate';
  const reason = isDuplicate
    ? 'Duplicate / Erroneous Billing Charge'
    : 'Unauthorized Recurring Charge / Billing Error';

  const letter = `Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

To: Cardholder Billing Disputes Department / Financial Institution
Re: Formal Notice of Disputed Transaction under the Fair Credit Billing Act (15 U.S.C. § 1666)

Cardholder Name: [Your Full Name]
Account Number: [XXXX-XXXX-XXXX-Last4]
Contact Email: [Your Email Address]

Dear Billing Dispute Department,

I am writing to formally dispute the following billing error appearing on my billing statement pursuant to the Fair Credit Billing Act:

- Transaction Date: ${tx.date}
- Merchant Name: ${tx.merchant}
- Disputed Amount: ₹${tx.amount.toFixed(2)}
- Reason for Dispute: ${reason}

EXPLANATION OF DISPUTE:
${isDuplicate 
  ? `This charge is an identical duplicate charge processed within days of the original legitimate transaction for the same merchant. I did not authorize multiple transactions.`
  : `This charge represents an unauthorized transaction or recurring billing that was processed without valid consent or after cancellation.`
}

I request that you issue an immediate provisional credit to my account in the amount of ₹${tx.amount.toFixed(2)} while your fraud and disputes unit investigates this matter with the merchant.

Please provide written acknowledgement of this notice within thirty (30) days as required by federal law.

Respectfully submitted,

________________________________________
[Cardholder Signature]
[Printed Name]`;

  return {
    transactionId: tx.id,
    merchant: tx.merchant,
    amount: tx.amount,
    date: tx.date,
    reason,
    formalLetter: letter,
  };
}
