import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from core.models import Affiliate

print(f"Users found: {User.objects.count()}")
for u in User.objects.all():
    print(f"User: {u.username}, Email: {u.email}, Staff: {u.is_staff}, Active: {u.is_active}")
    if hasattr(u, 'affiliate_profile'):
        print(f"  - Affiliate Profile: {u.affiliate_profile.referral_code}")
    else:
        print("  - NO Affiliate Profile")
