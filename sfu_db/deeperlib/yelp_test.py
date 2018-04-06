from deeperlib.api.yelp.searchapi import SearchApi

client_id = "QhqrWe9agsd0Ad6Gs0qgMQ"
client_secret = "6WQWRMV8edOhaThyWgm96wAJkIzJ1pHOhm5N0AD20edrnzv0lwi3wfgZAFp0IqQ6WIc-pZki83kjpViwptlcsiV0-Ij3HI6AJxhOTE4jsjNOoZOHZI3823twg8yZWXYx"
search_term = 'term'
parameters = {'limit': 5, 'location': 'Toronto'}
yelp = SearchApi(client_id=client_id, client_secret=client_secret, top_k=300, delay=5,
                 search_term=search_term,
                 **parameters)

query = ['thai', 'restaurant']
params = yelp.getKwargs()
params[yelp.getSearchTerm()] = '+'.join(query)
params['offset'] = 0
print params
results = yelp.callAPI(params)
for r in results:
    print r
print len(results)