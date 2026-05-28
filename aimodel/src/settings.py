import os
from os.path import join, dirname, abspath
from dotenv import load_dotenv

dotenv_path = join(dirname(dirname(abspath(__file__))), '.env')
load_dotenv(dotenv_path)

url_backend = os.environ.get("url_backend")
API_TOKEN = os.environ.get("API_TOKEN")