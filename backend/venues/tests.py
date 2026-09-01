from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from accounts.models import User
from .models import Venue
from decimal import Decimal


class VenueFilterTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		# two providers
		self.user1 = User.objects.create_user(email='a@example.com', phone='111', password='pass', full_name='U A', role='provider')
		self.user2 = User.objects.create_user(email='b@example.com', phone='222', password='pass', full_name='U B', role='provider')

		# provider 1 venues
		self.v1 = Venue.objects.create(provider=self.user1, name='V1', capacity=50, price_per_hour=Decimal('120.00'), status='active')
		self.v2 = Venue.objects.create(provider=self.user1, name='V2', capacity=20, price_per_hour=Decimal('80.00'), status='archived')

		# provider 2 venue
		self.v3 = Venue.objects.create(provider=self.user2, name='V3', capacity=200, price_per_hour=Decimal('300.00'), status='active')

	def test_provider_sees_only_their_venues(self):
		self.client.force_authenticate(self.user1)
		url = reverse('venue-list')
		resp = self.client.get(url)
		assert resp.status_code == 200
		ids = {r['id'] for r in resp.json()}
		assert str(self.v1.id) in ids and str(self.v2.id) in ids
		assert str(self.v3.id) not in ids

	def test_filter_min_max_price_and_capacity(self):
		self.client.force_authenticate(self.user1)
		url = reverse('venue-list')

		# min_price -> only v1
		resp = self.client.get(url, {'min_price': '100'})
		assert resp.status_code == 200
		ids = {r['id'] for r in resp.json()}
		assert str(self.v1.id) in ids and str(self.v2.id) not in ids

		# max_capacity -> only v2 if max_capacity 30
		resp = self.client.get(url, {'max_capacity': '30'})
		ids = {r['id'] for r in resp.json()}
		assert str(self.v2.id) in ids and str(self.v1.id) not in ids

	def test_search_by_provider_and_fields(self):
		# search by provider full_name
		self.client.force_authenticate(self.user1)
		url = reverse('venue-list')
		resp = self.client.get(url, {'search': 'U A'})
		assert resp.status_code == 200
		ids = {r['id'] for r in resp.json()}
		assert str(self.v1.id) in ids and str(self.v2.id) in ids

		# search by provider email shouldn't return venues of other provider
		resp = self.client.get(url, {'search': 'a@example.com'})
		ids = {r['id'] for r in resp.json()}
		assert str(self.v1.id) in ids and str(self.v3.id) not in ids

