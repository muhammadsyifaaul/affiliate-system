from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import AffiliateViewSet, TransactionViewSet, WithdrawalViewSet, ProductViewSet, RegisterView

router = DefaultRouter()
router.register(r'affiliates', AffiliateViewSet, basename='affiliate')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'withdrawals', WithdrawalViewSet, basename='withdrawal')
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api-auth/', include('rest_framework.urls')), # Login/Logout for browsable API
]
