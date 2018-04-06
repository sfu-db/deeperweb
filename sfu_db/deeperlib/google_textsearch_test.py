from deeperlib.api.google.textsearchapi import TextSearchApi

search_term = 'query'
parameters = {'key': 'AIzaSyDhBJSPqHfcEkPGQGbH7l3eWyF_PhF10iw'}
api = TextSearchApi(location='in+Toronto', top_k=60, delay=5, search_term=search_term, **parameters)
queries = [['thai', 'restaurant'], ['Chinese', 'restaurant'], ['mcdonalds']]
cur_raw_result = api.callMulAPI(queries)
for c in cur_raw_result:
    print c['place_id']
print len(cur_raw_result)