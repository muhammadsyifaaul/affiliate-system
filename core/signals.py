from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Affiliate

@receiver(post_save, sender=User)
def create_affiliate_profile(sender, instance, created, **kwargs):
    if created:
        Affiliate.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_affiliate_profile(sender, instance, **kwargs):
    if hasattr(instance, 'affiliate_profile'):
        instance.affiliate_profile.save()
