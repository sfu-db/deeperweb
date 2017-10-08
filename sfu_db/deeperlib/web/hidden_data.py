import os
from deeperlib.data_processing.data_process import wordset, getElement
from json2csv import Json2csv


class HiddenData:
    def __init__(self, uniqueid, matchlist):
        self.setUniqueId(uniqueid)
        self.setMatchList(matchlist)
        self.setMergeResult({})

    def proResult(self, result_raw):
        uniqueid = self.__uniqueId.split('.')
        matchlist = []
        for m in self.__matchList:
            matchlist.append(m.split('.'))

        result_merge = self.__mergeResult
        result_er = []
        for row in result_raw:
            r_id = getElement(uniqueid, row)
            if r_id not in result_merge:
                result_merge[r_id] = row
                bag = []
                for m in matchlist:
                    bag.extend(wordset(getElement(m, row)))
                result_er.append((bag, r_id))
        self.setMergeResult(result_merge)
        return result_er

    def setUniqueId(self, uniqueid):
        self.__uniqueId = uniqueid

    def getUniqueId(self):
        return self.__uniqueId

    def setMatchList(self, matchlist):
        self.__matchList = matchlist

    def getMatchList(self):
        return self.__matchList

    def setMatchPair(self, matchpair):
        matchPair = {}
        for m in matchpair:
            matchPair[m[0]] = []
        for m in matchpair:
            matchPair[m[0]].append(m[1])
        self.__matchPair = matchPair

    def getMatchPair(self):
        return self.__matchPair

    def setMergeResult(self, mergeresult):
        self.__mergeResult = mergeresult

    def getMergeResult(self):
        return self.__mergeResult
