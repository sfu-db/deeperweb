import sys

reload(sys)
sys.setdefaultencoding('utf-8')
from django.conf import settings
from deeperlib.api.dblp.publapi import PublApi
from deeperlib.data_processing.sample_data import SampleData
from smartcrawl import smartCrawl
from local_data import LocalData
from hidden_data import HiddenData
from json2csv import Json2csv


def smartcrawl_web(budget, original_csv):
    search_term = 'q'
    parameters = {'h': 1000}
    dblp = PublApi(top_k=1000, delay=4, search_term=search_term, **parameters)

    sample_file = settings.BASE_DIR + '/netdisk/dblp_sample.csv'
    sampledata = SampleData(sample_ratio=0.5, samplepath=sample_file, filetype='csv', uniqueid="key",
                            querylist=["title"])
    localdata = LocalData(uniqueid="ID", querylist=['title'], matchlist=['title'], data_raw=original_csv)
    hiddendata = HiddenData(uniqueid="info.key", matchlist=["info.title"])

    smartCrawl(budget, dblp, sampledata, localdata, hiddendata)
    localdata_csv = localdata.getRawData()
    crawldata_csv = Json2csv(hiddendata.getMergeResult()).getCsvdata()
    print crawldata_csv['header']
    join_csv = []
    join_csv.append(localdata_csv['header'] + crawldata_csv['header'])
    matchpair = sorted(hiddendata.getMatchPair().items(), key=lambda item: int(item[0]), reverse=False)
    for m in matchpair:
        local_id = m[0]
        for hidden_id in m[1]:
            join_csv.append(localdata_csv[local_id] + crawldata_csv[hidden_id])
    return join_csv
