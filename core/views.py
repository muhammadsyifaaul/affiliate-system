from rest_framework import viewsets, permissions, status, views
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Affiliate, Transaction, Withdrawal, Product
from .serializers import AffiliateSerializer, TransactionSerializer, WithdrawalSerializer, ProductSerializer

class IsAffiliateOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class AffiliateViewSet(viewsets.ReadOnlyModelViewSet):
    """
    View your own affiliate profile.
    """
    serializer_class = AffiliateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Affiliate.objects.filter(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()] # Allow external systems to post transactions
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Admin sees all, User sees theirs
        if self.request.user.is_staff:
            return Transaction.objects.all()
        return Transaction.objects.filter(affiliate__user=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        Record a transaction. Expects 'referral_code' in body.
        Optional 'product_id'
        """
        referral_code = request.data.get('referral_code')
        order_id = request.data.get('order_id')
        transaction_amount = request.data.get('amount') # Renamed to explicitly separate from product.price
        product_id = request.data.get('product') or request.data.get('product_id')

        product = None
        if product_id:
            product = get_object_or_404(Product, pk=product_id)
            if not transaction_amount:
                transaction_amount = product.price
        
        # If no product and no amount, fail
        if not referral_code or not transaction_amount:
            return Response({"error": "Missing referral_code or amount (or valid product_id)"}, status=status.HTTP_400_BAD_REQUEST)

        affiliate = get_object_or_404(Affiliate, referral_code=referral_code)
        
        transaction = Transaction.objects.create(
            affiliate=affiliate,
            product=product,
            order_id=order_id or f"ORD-{transaction_amount}", # Fallback/Mock ID
            amount=transaction_amount,
            status='COMPLETED' # Auto-complete for simplicity in this demo
        )
        
        return Response(TransactionSerializer(transaction).data, status=status.HTTP_201_CREATED)

class WithdrawalViewSet(viewsets.ModelViewSet):
    serializer_class = WithdrawalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Withdrawal.objects.all()
        return Withdrawal.objects.filter(affiliate__user=self.request.user)

    def perform_create(self, serializer):
        # Auto-link the requesting user's affiliate profile
        affiliate = get_object_or_404(Affiliate, user=self.request.user)
        serializer.save(affiliate=affiliate)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        withdrawal = self.get_object()
        withdrawal.status = 'APPROVED'
        withdrawal.reviewed_at = timezone.now()
        withdrawal.save()
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        withdrawal = self.get_object()
        withdrawal.status = 'REJECTED'
        withdrawal.reviewed_at = timezone.now()
        withdrawal.save()
        return Response({'status': 'rejected'})
