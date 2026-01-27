"""
WSGI config for SportConnectGN.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sportconnectgn.settings")

application = get_wsgi_application()

