import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from django.conf import settings
import time
from deeperlib.api.dblp.publapi import PublApi
from deeperlib.data_processing.sample_data import SampleData
from smartcrawl import smartCrawl
from local_data import LocalData
from hidden_data import HiddenData
from json2csv import Json2csv


def smartcrawl_web(budget, api_msg, original_csv, local_match, hidden_match):
    if api_msg == 'dblp Publ API':
        search_term = 'q'
        parameters = {'h': 1000}
        api = PublApi(top_k=1000, delay=4, search_term=search_term, **parameters)
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

    smartCrawl(budget, api, sampledata, localdata, hiddendata)
    localdata_csv = localdata.getRawData()
    crawldata_csv = Json2csv(hiddendata.getMergeResult()).getCsvdata()
    join_csv = []
    join_csv.append(localdata_csv['header'] + crawldata_csv['header'])
    matchpair = sorted(hiddendata.getMatchPair().items(), key=lambda item: item[0], reverse=False)
    for m in matchpair:
        local_id = m[0]
        for hidden_id in m[1]:
            join_csv.append(localdata_csv[local_id] + crawldata_csv[hidden_id])
    return join_csv
