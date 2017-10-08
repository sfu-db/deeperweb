import sys

reload(sys)
sys.setdefaultencoding('utf-8')
import random
import copy


class Json2csv:
    def __init__(self, jsondata):
        self.__header = []
        if len(jsondata) > 0:
            if len(jsondata) > 1:
                self.__getHeader(random.choice(jsondata.values()))
            else:
                self.__getHeader(jsondata.values()[0])
            # write header
            csvdata = {}
            csvdata['header'] = self.__header
            # write row
            for key, value in jsondata.iteritems():
                temprow = []
                for h in self.__header:
                    temprow.append(self.__getElement(h.split('.'), value))
                csvdata[key] = temprow
            self.setCsvdata(csvdata)
        else:
            self.setCsvdata({})

    def __getHeader(self, row, parentNode=''):

        if not isinstance(row, list):
            for q, v in row.iteritems():
                if isinstance(v, dict):
                    self.__getHeader(v, parentNode + str(q) + '.')
                elif isinstance(v, list):
                    self.__getHeader(v, parentNode + str(q) + '.*.')
                else:
                    self.__header.append(parentNode + str(q))
        else:
            if len(row) > 0 and isinstance(row[0], dict):
                self.__getHeader(row[0], parentNode)
            else:
                self.__header.append(parentNode[:-1])

    def __getElement(self, node_list, data):

        temp = copy.deepcopy(data)
        result = ''
        try:
            for i, node in enumerate(node_list):
                if node.isdigit():
                    temp = temp[int(node)]
                elif node == '*':
                    if i == len(node_list) - 1:
                        for ele in temp:
                            result += str(ele) + ' '
                    else:
                        for ele in temp:
                            result += str(self.__getElement(node_list[i + 1:], ele)) + ' '
                    return result.lstrip()
                else:
                    temp = temp[node]
            result = temp
        except (KeyError, TypeError, IndexError):
            pass
        return result

    def setCsvdata(self, csvdata):
        self.__csvdata = csvdata

    def getCsvdata(self):
        return self.__csvdata
