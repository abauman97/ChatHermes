"""Seed only the dedicated compose volume; profile-scoped Hermes reads its own .env."""
import json
import os
import shutil
from pathlib import Path

home = Path('/opt/data')
home.mkdir(parents=True, exist_ok=True)
shutil.copyfile('/test/config.yaml', home / 'config.yaml')
keys = ('LITELLM_BASE_URL', 'LITELLM_API_KEY', 'API_SERVER_KEY')
values = {key: os.environ.get(key, '') for key in keys}
(home / '.env').write_text(''.join(key + '=' + json.dumps(value) + '\n' for key, value in values.items()))
(home / '.env').chmod(0o600)
# A second isolated profile makes profile switching repeatable without personal data.
secondary = home / 'profiles' / 'test-profile'
secondary.mkdir(parents=True, exist_ok=True)
shutil.copyfile(home / 'config.yaml', secondary / 'config.yaml')
shutil.copyfile(home / '.env', secondary / '.env')
(secondary / '.env').chmod(0o600)
