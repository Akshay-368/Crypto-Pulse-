from django.shortcuts import render
import requests
from firebase_admin import db

def fetch_and_store_crypto_data():
    url = 'https://api.coingecko.com/api/v3/coins/markets'
    params = {
        'vs_currency': 'usd',
        'order': 'market_cap_desc',
        'per_page': 100,
        'page': 1,
        'sparkline': False,
    }
    response = requests.get(url, params=params)
    data = response.json()

    # Store data in Firebase
    ref = db.reference('cryptocurrency/market_data')
    ref.set(data)

def crypto_view(request):
    fetch_and_store_crypto_data()  # Fetch and store data from the API
    ref = db.reference('cryptocurrency/market_data')
    crypto_data = ref.get()  # Fetch data from Firebase

    search_query = request.GET.get('search', '').lower()
    is_search = False
    no_results = False
    detailed_crypto_data = None

    if search_query:
        # Check if the searched coin exists in the current data
        matching_coins = [coin for coin in crypto_data if search_query in coin['name'].lower()]
        if matching_coins:
            # Get the ID of the first matched coin
            coin_id = matching_coins[0]['id']
            # Fetch detailed data for the specific coin
            detailed_url = f'https://api.coingecko.com/api/v3/coins/{coin_id}'
            detailed_response = requests.get(detailed_url)
            
            if detailed_response.status_code == 200:
                detailed_crypto_data = detailed_response.json()
                # Use detailed data in the list for template
                crypto_data = [{
                    'name': detailed_crypto_data['name'],
                    'symbol': detailed_crypto_data['symbol'],
                    'current_price': detailed_crypto_data['market_data']['current_price']['usd'],
                    'market_cap': detailed_crypto_data['market_data']['market_cap']['usd'],
                    'market_cap_rank': detailed_crypto_data['market_cap_rank'],
                    'image': detailed_crypto_data['image']['large'],
                    'high_24h': detailed_crypto_data['market_data']['high_24h']['usd'],
                    'low_24h': detailed_crypto_data['market_data']['low_24h']['usd'],
                    'price_change_24h': detailed_crypto_data['market_data']['price_change_24h'],
                    'price_change_percentage_24h': detailed_crypto_data['market_data']['price_change_percentage_24h'],
                    'market_cap_change_24h': detailed_crypto_data['market_data']['market_cap_change_24h'],
                    'market_cap_change_percentage_24h': detailed_crypto_data['market_data']['market_cap_change_percentage_24h'],
                    'circulating_supply': detailed_crypto_data['market_data']['circulating_supply'],
                    'total_supply': detailed_crypto_data['market_data']['total_supply'],
                    'max_supply': detailed_crypto_data['market_data']['max_supply'],
                    'ath': detailed_crypto_data['market_data']['ath']['usd'],
                    'atl': detailed_crypto_data['market_data']['atl']['usd'],
                    'last_updated': detailed_crypto_data['market_data']['last_updated'],
                }]
                is_search = True
            else:
                crypto_data = []  # No detailed data found
        else:
            # No matching coins found
            crypto_data = []
            no_results = True

    return render(request, 'dashboard.html', {
        'crypto_data': crypto_data,
        'is_search': is_search,
        'no_results': no_results,
    })
