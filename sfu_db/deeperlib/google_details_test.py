from deeperlib.api.google.detailsapi import DetailsApi

search_term = 'placeid'
parameters = {'key': 'AIzaSyDhBJSPqHfcEkPGQGbH7l3eWyF_PhF10iw'}
api = DetailsApi(delay=5, search_term=search_term, **parameters)
queries = ['ChIJ1wF25jPL1IkRNPE3GI6ixuk','ChIJO3MIyK00K4gRabWx1ByiWZE','ChIJX_Y1ujnL1IkRQg3ferymowM',
           'ChIJ1ZGZKNk0K4gRaouNzuptWV8','ChIJsYytfdo0K4gRyuS_nZmdpIQ','ChIJHz3FJto0K4gRv9m8KY39cks',
           'ChIJgTMjWOE0K4gRjxgMysLSQCE','ChIJg_PaW8k0K4gR3v9FU5kJHcM','ChIJ5_z4eSEzK4gRE7-8VqpxTgM',
           'ChIJ2Uabx8o0K4gR0prH0ZEi390','ChIJ3Ro5mK7O1IkRjAigSBtLlIo','ChIJg7AN9xU0K4gRnkW58DFL-Q4',
           'ChIJ7TPROCUzK4gR3wTwLUk2A0A','ChIJMdHbHugyK4gRa-IIA-B_0oc','ChIJB9CWKTAzK4gRqYVbK4D8Bpg',
           'ChIJrYsA3QDM1IkRx5tzKQ3aT2M','ChIJjfNkwCE0K4gRcMLiTy0ZdRo','ChIJu07e5eM0K4gRV3TYK5LnboE']
cur_raw_result = api.callMulAPI(queries)
for c in cur_raw_result:
    print c['place_id']
print len(cur_raw_result)