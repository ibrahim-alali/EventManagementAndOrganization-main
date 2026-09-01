# EMO — Event Management and Organization

A Django REST API for managing events, venues, bookings, and reviews, with a
built-in recommendation engine that suggests venues and events to users.

## Features

- **JWT authentication** with role-based accounts: `client`, `provider`, and `organizer`
- **Venues** — providers list venues, with images, filtering, and archiving
- **Events** — organizers create events, manage invitations, and issue QR-coded tickets
- **Reviews & votes** — clients rate venues/events; a voting system supports comparisons
- **Dashboards** — stats and recent-activity endpoints per role (client, provider, organizer)
- **Recommendation system** — a candidate/scoring/boosting pipeline that ranks venues
  and events per user
- **API documentation** — OpenAPI schema with Swagger UI and Redoc via `drf-spectacular`

## Tech stack

- Python / Django 4.2 + Django REST Framework
- SimpleJWT for authentication
- SQLite (default, swappable via `DATABASES` in settings)
- `django-filter`, `django-cors-headers`, `qrcode`, `numpy`

## Project structure

```
backend/
├── EMO_EventManagementAndOrganization/  # Project settings, URLs, WSGI/ASGI
├── accounts/                            # Auth, users, roles
├── venues/                              # Venue listings and images
├── events/                              # Events, invitations, QR tickets
├── general/                             # Reviews, votes, shared dashboards
└── recommendation/                      # Recommendation pipeline (venues & events)
```

## Getting started

### Prerequisites

- Python 3.11+
- pip

### Setup

```bash
git clone https://github.com/ibrahim-alali/EMO_EventManagementAndOrganization.git
cd EMO_EventManagementAndOrganization/backend

python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt

copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux
# then edit .env and set your own DJANGO_SECRET_KEY

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/`.

### API documentation

- Swagger UI: `/api/docs/`
- Redoc: `/api/redoc/`
- Raw schema: `/api/schema/`

## Environment variables

See [`backend/.env.example`](backend/.env.example). At minimum, set a unique
`DJANGO_SECRET_KEY` before deploying and set `DJANGO_DEBUG=False` with proper
`DJANGO_ALLOWED_HOSTS` in production.

## License

This project currently has no license file — all rights reserved by the author
unless stated otherwise.
