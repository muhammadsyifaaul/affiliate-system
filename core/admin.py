from django.contrib import admin
from .models import Affiliate, Transaction, Withdrawal, Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'created_at')

@admin.register(Affiliate)
class AffiliateAdmin(admin.ModelAdmin):
    list_display = ('user', 'referral_code', 'total_earnings', 'commission_percentage')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'affiliate', 'product', 'amount', 'commission_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')

@admin.register(Withdrawal)
class WithdrawalAdmin(admin.ModelAdmin):
    list_display = ('affiliate', 'amount', 'status', 'created_at')
    list_filter = ('status',)
    actions = ['approve_withdrawal']

    def approve_withdrawal(self, request, queryset):
        queryset.update(status='APPROVED')
