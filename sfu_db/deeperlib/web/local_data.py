from sys import stderr as perr
import copy
from deeperlib.data_processing.data_process import wordset, getElement


class LocalData:
    def __init__(self, uniqueid, querylist, matchlist, data_raw):

        self.setUniqueId(uniqueid)
        self.setQueryList(querylist)
        self.setMatchList(matchlist)
        self.read_web(data_raw)

    def read_web(self, data_raw):
        uniqueid_index = 0
        querylist_index = []
        matchlist_index = []
        try:
            header = data_raw.pop(0)
            uniqueid_index = header.index(self.__uniqueId)
            for q in self.__queryList:
                querylist_index.append(header.index(q))
            for m in self.__matchList:
                matchlist_index.append(header.index(m))
        except (KeyError, ValueError):
            print >> perr, "Can't find attributes"
            exit(0)

        localdata_query = {}
        localdata_er = []
        localdata_ids = set()
        localdata_raw = {}
        localdata_raw['header'] = header
        stop_words = ['and', 'for', 'the', 'with', 'about']
        for row in data_raw:
            try:
                r_id = row[uniqueid_index]
            except IndexError:
                continue
            localdata_ids.add(r_id)
            localdata_raw[r_id] = row

            tempbag = []
            for q in querylist_index:
                try:
                    tempbag.extend(wordset(row[q]))
                except IndexError:
                    continue
            bag = []
            for word in tempbag:
                if word not in stop_words and len(word) >= 3:
                    bag.append(word)
            localdata_query[r_id] = bag

            bag = []
            for m in matchlist_index:
                try:
                    bag.extend(wordset(row[m]))
                except IndexError:
                    continue
            localdata_er.append((bag, r_id))
        self.setRawData(localdata_raw)
        self.setlocalData(localdata_ids, localdata_query, localdata_er)

    def setRawData(self, localdata_raw):
        self.__localdataRaw = localdata_raw

    def getRawData(self):
        return self.__localdataRaw

    def setUniqueId(self, uniqueid):
        self.__uniqueId = uniqueid

    def getUniqueId(self):
        return self.__uniqueId

    def setQueryList(self, querylist):
        self.__queryList = querylist

    def getQueryList(self):
        return self.__queryList

    def setMatchList(self, matchlist):
        self.__matchList = matchlist

    def getMatchList(self):
        return self.__matchList

    def setlocalData(self, localdata_ids, localdata_query, localdata_er):
        self.__localdataIds = localdata_ids
        self.__localdataQuery = localdata_query
        self.__localdataEr = localdata_er

    def getlocalData(self):
        return self.__localdataIds, self.__localdataQuery, self.__localdataEr
