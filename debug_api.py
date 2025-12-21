import requests
import base64

url = 'http://127.0.0.1:8000/api/transactions/'
auth_str = 'admin:admin'
b64_auth = base64.b64encode(auth_str.encode()).decode()
headers = {'Authorization': f'Basic {b64_auth}'}

try:
    response = requests.get(url, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response URL: {response.url}")
    print(f"Response Data: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
