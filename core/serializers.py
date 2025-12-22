from rest_framework import serializers
from .models import Affiliate, Transaction, Withdrawal, Product
from django.contrib.auth.models import User

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        # Auto-create affiliate profile
        Affiliate.objects.create(user=user)
        return user

class AffiliateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    total_earnings = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    current_balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Affiliate
        fields = ['id', 'user', 'referral_code', 'commission_percentage', 'total_earnings', 'current_balance', 'created_at']

class TransactionSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = Transaction
        fields = ['id', 'order_id', 'product', 'product_name', 'amount', 'commission_amount', 'status', 'created_at']
        read_only_fields = ['commission_amount', 'affiliate', 'amount'] # Amount is read-only if product is optional? Let's allow amount override if needed, but normally product price. 
        # Actually models.py handles amount if missing. So we can keep it writable or read-only. Let's keep writable for flexibility but optional.
        extra_kwargs = {'amount': {'required': False}}

class WithdrawalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdrawal
        fields = '__all__'
        read_only_fields = ['status', 'reviewed_at', 'affiliate', 'fee']
    
    def validate(self, data):
        # Check balance
        user = self.context['request'].user
        if not user.is_staff: # Admins can bypass
            affiliate = user.affiliate_profile
            # Simple simulation fee
            fee = 1.50
            if (data['amount'] + fee) > float(affiliate.current_balance):
                raise serializers.ValidationError(f"Insufficient funds. Balance: {affiliate.current_balance}, Request+Fee: {data['amount'] + fee}")
        return data
