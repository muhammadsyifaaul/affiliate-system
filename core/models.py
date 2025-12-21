from django.db import models
from django.contrib.auth.models import User
import uuid
from decimal import Decimal

class Affiliate(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='affiliate_profile')
    referral_code = models.CharField(max_length=20, unique=True, blank=True)
    commission_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=10.00) # e.g., 10.00%
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.referral_code:
            self.referral_code = str(uuid.uuid4()).split('-')[0].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} ({self.referral_code})"

    @property
    def total_earnings(self):
        return sum(t.commission_amount for t in self.transactions.filter(status='COMPLETED')) or Decimal('0.00')

    @property
    def current_balance(self):
        earnings = self.total_earnings
        withdrawals = self.withdrawals.exclude(status='REJECTED')
        total_withdrawn = sum(w.amount + w.fee for w in withdrawals) or Decimal('0.00')
        return earnings - total_withdrawn

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(blank=True, help_text="Placeholder image URL") # Simple visual
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    affiliate = models.ForeignKey(Affiliate, on_delete=models.CASCADE, related_name='transactions')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    order_id = models.CharField(max_length=100, help_text="Order ID from the external system")
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total transaction amount")
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Allow amount to be auto-filled if product is available
        if self.product and not self.amount:
            self.amount = self.product.price

        # Calculate commission automatically
        if not self.commission_amount and self.amount:
            # Convert to float for calc then back to Decimal
            comm = (float(self.amount) * float(self.affiliate.commission_percentage)) / 100
            self.commission_amount = Decimal(str(comm)) # str() ensures better conversion than direct float
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_id} - {self.status}"

class Withdrawal(models.Model):
    STATUS_CHOICES = (
        ('REQUESTED', 'Requested'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )
    METHOD_CHOICES = (
        ('PAYPAL', 'PayPal'),
        ('DANA', 'Dana'),
        ('BANK_TRANSFER', 'Bank Transfer'),
        ('CRYPTO', 'Crypto (USDT)'),
    )

    affiliate = models.ForeignKey(Affiliate, on_delete=models.CASCADE, related_name='withdrawals')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_method = models.CharField(max_length=50, choices=METHOD_CHOICES, default='BANK_TRANSFER')
    payment_details = models.TextField(help_text="Account number, email, or wallet address")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='REQUESTED')
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.id and not self.fee:
            self.fee = Decimal('1.50')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.affiliate.user.username} - {self.amount} - {self.status}"
