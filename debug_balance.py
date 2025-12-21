import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Affiliate, Transaction, Withdrawal

affiliate = Affiliate.objects.first()
print(f"Affiliate: {affiliate.referral_code}")

print("\n--- Transactions ---")
total_comm = Decimal('0.00')
for t in affiliate.transactions.filter(status='COMPLETED'):
    print(f"ID: {t.id} | Product: {t.product} | Amount: {t.amount} | Comm: {t.commission_amount}")
    total_comm += t.commission_amount
print(f"Calculated Total Earnings: {total_comm}")
print(f"Model Total Earnings: {affiliate.total_earnings}")

print("\n--- Withdrawals ---")
total_withdrawn = Decimal('0.00')
for w in affiliate.withdrawals.exclude(status='REJECTED'):
    print(f"ID: {w.id} | Amount: {w.amount} | Fee: {w.fee} | Status: {w.status}")
    total_withdrawn += (w.amount + w.fee)
print(f"Total Deductions: {total_withdrawn}")

print("\n--- Balance ---")
expected_balance = total_comm - total_withdrawn
print(f"Expected Balance: {expected_balance}")
print(f"Model Current Balance: {affiliate.current_balance}")
