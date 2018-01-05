import sys

reload(sys)
sys.setdefaultencoding('utf-8')
from django.conf import settings
import time
from deeperlib.api.dblp.publapi import PublApi
from deeperlib.api.yelp.searchapi import SearchApi
from deeperlib.api.aminer.advanced_publapi import AdvancedPublApi
from deeperlib.data_processing.sample_data import SampleData
from webcrawl import SmartCrawl, NaiveCrawl
from local_data import LocalData
from hidden_data import HiddenData
from json2csv import Json2csv
from deeper_htmlparser import Deeper_HTMLParser


def Deeper_WEB(budget, api_msg, original_csv, local_match, hidden_match):
    typo_ids = []
    parser = Deeper_HTMLParser()
    for i in range(1, len(original_csv)):
        for j in range(1, len(original_csv[i])):
            if '</span>' in original_csv[i][j]:
                parser.feed(original_csv[i][j])
                original_csv[i][j] = parser.get_text()
                typo_ids.append(original_csv[i][0])
                break

    if api_msg == 'dblp Publ API':
        search_term = 'q'
        parameters = {'h': 1000}
        api = PublApi(top_k=1000, delay=5, search_term=search_term, **parameters)
        sample_file = settings.BASE_DIR + '/netdisk/dblp_sample.csv'
        sampledata = SampleData(sample_ratio=0.5, samplepath=sample_file, filetype='csv', uniqueid="key",
                                querylist=["title"])
        hiddendata = HiddenData(uniqueid="info.key", matchlist=["info.title"])

        if "info.key" in hidden_match:
            localdata = LocalData(uniqueid=local_match[hidden_match.index("info.key")],
                                  querylist=[local_match[hidden_match.index("info.title")]],
                                  matchlist=[local_match[hidden_match.index("info.title")]], data_raw=original_csv)
        else:
            uniqueID = 'ID' + str(int(time.time()))
            original_csv[0].append(uniqueID)
            for i in range(1, len(original_csv)):
                original_csv[i].append(i)
            localdata = LocalData(uniqueid=uniqueID,
                                  querylist=[local_match[hidden_match.index("info.title")]],
                                  matchlist=[local_match[hidden_match.index("info.title")]], data_raw=original_csv)
    elif api_msg == 'aminer Publ API':
        search_term = 'term'
        parameters = {'size': 100, 'sort': 'relevance'}
        api = AdvancedPublApi(top_k=300, delay=5, search_term=search_term, **parameters)
        sample_file = settings.BASE_DIR + '/netdisk/dblp_sample.csv'
        sampledata = SampleData(sample_ratio=0.5, samplepath=sample_file, filetype='csv', uniqueid="key",
                                querylist=["title"])
        hiddendata = HiddenData(uniqueid="id", matchlist=["title"])

        if "id" in hidden_match:
            localdata = LocalData(uniqueid=local_match[hidden_match.index("id")],
                                  querylist=[local_match[hidden_match.index("title")]],
                                  matchlist=[local_match[hidden_match.index("title")]], data_raw=original_csv)
        else:
            uniqueID = 'ID' + str(int(time.time()))
            original_csv[0].append(uniqueID)
            for i in range(1, len(original_csv)):
                original_csv[i].append(i)
            localdata = LocalData(uniqueid=uniqueID,
                                  querylist=[local_match[hidden_match.index("title")]],
                                  matchlist=[local_match[hidden_match.index("title")]], data_raw=original_csv)
    elif api_msg == 'yelp Search API':
        client_id = "kCe2YbZePXsPnC204ZrXoQ"
        client_secret = "s9KnvEEQW7jaA2wlrBi4X2fnDQ0F7asdklXVvJUidWp8i50ov24E8EjkHX2AUhoL"
        search_term = 'term'
        parameters = {'limit': 50, 'location': 'AZ'}
        api = SearchApi(client_id=client_id, client_secret=client_secret, top_k=300, delay=5, search_term=search_term,
                        **parameters)
        sample_file = settings.BASE_DIR + '/netdisk/yelp_sample_Arizona.pkl'
        sampledata = SampleData(sample_ratio=0.5, samplepath=sample_file, filetype='pkl', uniqueid="id",
                                querylist=["name"])
        hiddendata = HiddenData(uniqueid="id", matchlist=["name", "location.display_address.*"])
        if "id" in hidden_match:
            localdata = LocalData(uniqueid=local_match[hidden_match.index("id")],
                                  querylist=[local_match[hidden_match.index("name")]],
                                  matchlist=[local_match[hidden_match.index("name")],
                                             local_match[hidden_match.index("location.display_address.*")]],
                                  data_raw=original_csv)
        else:
            uniqueID = 'ID' + str(int(time.time()))
            original_csv[0].append(uniqueID)
            for i in range(1, len(original_csv)):
                original_csv[i].append(i)
            localdata = LocalData(uniqueid=uniqueID,
                                  querylist=[local_match[hidden_match.index("name")]],
                                  matchlist=[local_match[hidden_match.index("name")],
                                             local_match[hidden_match.index("location.display_address.*")]],
                                  data_raw=original_csv)
    SmartCrawl(budget, api, sampledata, localdata, hiddendata)
    localdata_csv = localdata.getRawData()
    crawldata_csv = Json2csv(hiddendata.getMergeResult()).getCsvdata()

    result = {}
    result['record'] = []
    if 'header' in crawldata_csv:
        result['local_header'] = localdata_csv['header']
        result['hidden_header'] = crawldata_csv['header']
        try:
            matchpair = sorted(hiddendata.getMatchPair().items(), key=lambda item: int(item[0]), reverse=False)
        except (ValueError):
            matchpair = sorted(hiddendata.getMatchPair().items(), key=lambda item: item[0], reverse=False)
        for m in matchpair:
            temp_record = []
            local_id = m[0]
            temp_record.append(localdata_csv[local_id])
            for hidden_id in m[1]:
                temp_record.append(crawldata_csv[hidden_id])
            result['record'].append(temp_record)
    else:
        result['local_header'] = localdata_csv['header']

    if api_msg == 'dblp Publ API':
        search_term = 'q'
        parameters = {'h': 1}
        api = PublApi(top_k=1, delay=5, search_term=search_term, **parameters)
        hiddendata = HiddenData(uniqueid="info.key", matchlist=["info.title"])
    elif api_msg == 'aminer Publ API':
        search_term = 'term'
        parameters = {'size': 1, 'sort': 'relevance'}
        api = AdvancedPublApi(top_k=1, delay=5, search_term=search_term, **parameters)
        hiddendata = HiddenData(uniqueid="id", matchlist=["title"])
    elif api_msg == 'yelp Search API':
        client_id = "kCe2YbZePXsPnC204ZrXoQ"
        client_secret = "s9KnvEEQW7jaA2wlrBi4X2fnDQ0F7asdklXVvJUidWp8i50ov24E8EjkHX2AUhoL"
        search_term = 'term'
        parameters = {'limit': 1, 'location': 'AZ'}
        api = SearchApi(client_id=client_id, client_secret=client_secret, top_k=1, delay=5,
                        search_term=search_term,
                        **parameters)
        hiddendata = HiddenData(uniqueid="id", matchlist=["name", "location.display_address.*"])
    result['naive'] = NaiveCrawl(4, api, localdata, hiddendata, typo_ids)

    return result
