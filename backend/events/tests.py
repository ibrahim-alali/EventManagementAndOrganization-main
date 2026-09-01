from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from accounts.models import User
from venues.models import Venue
from .models import Event
from datetime import date


class EventFilteringTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.org = User.objects.create_user(email='o@example.com', phone='333', password='pass', full_name='Org', role='organizer')
		self.other = User.objects.create_user(email='u@example.com', phone='444', password='pass', full_name='Other', role='client')
		self.provider = User.objects.create_user(email='p@example.com', phone='555', password='pass', full_name='Prov', role='provider')

		self.venue = Venue.objects.create(provider=self.provider, name='Venue A', capacity=100, price_per_hour=200)

		# events: different dates, visibility and statuses
		self.e1 = Event.objects.create(organizer=self.org, venue=self.venue, title='Public Today', date=date(2025,1,1), start_time='09:00', end_time='10:00', is_public=True, status='scheduled')
		self.e2 = Event.objects.create(organizer=self.org, venue=self.venue, title='Private Later', date=date(2025,2,1), start_time='09:00', end_time='10:00', is_public=False, status='scheduled')
		self.e3 = Event.objects.create(organizer=self.other, venue=self.venue, title='Public Other', date=date(2025,3,1), start_time='09:00', end_time='10:00', is_public=True, status='completed')

	def test_list_shows_organizer_and_public(self):
		self.client.force_authenticate(self.org)
		url = reverse('event-list')
		resp = self.client.get(url)
		assert resp.status_code == 200
		# organizer should see their events plus public ones
		ids = {r['id'] for r in resp.json()}
		assert str(self.e1.id) in ids
		assert str(self.e2.id) in ids
		assert str(self.e3.id) in ids

	def test_filter_by_date_and_public_and_status(self):
		self.client.force_authenticate(self.org)
		url = reverse('event-list')

		# min_date -> events on/after 2025-02-01
		resp = self.client.get(url, {'min_date': '2025-02-01'})
		ids = {r['id'] for r in resp.json()}
		assert str(self.e2.id) in ids
		assert str(self.e1.id) not in ids

		# is_public false -> should only include private events of organizer
		resp = self.client.get(url, {'is_public': 'false'})
		ids = {r['id'] for r in resp.json()}
		# e2 is private and belongs to organizer
		assert str(self.e2.id) in ids and str(self.e1.id) not in ids

	def test_search_by_venue_and_organizer(self):
		url = reverse('event-list')

		# as organizer - can see own private + public events matching venue name
		self.client.force_authenticate(self.org)
		resp = self.client.get(url, {'search': 'Venue A'})
		assert resp.status_code == 200
		ids = {r['id'] for r in resp.json()}
		assert str(self.e1.id) in ids and str(self.e2.id) in ids and str(self.e3.id) in ids

		# as anonymous - only public events are visible
		self.client.force_authenticate(user=None)
		resp = self.client.get(url, {'search': 'Public'})
		ids = {r['id'] for r in resp.json()}
		assert str(self.e1.id) in ids and str(self.e3.id) in ids and str(self.e2.id) not in ids

