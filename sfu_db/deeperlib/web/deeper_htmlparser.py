from HTMLParser import HTMLParser


class Deeper_HTMLParser(HTMLParser):

    def __init__(self):
        HTMLParser.__init__(self)
        self.__text = ""
        self.__span_tag = False

    def get_text(self):
        text = self.__text
        self.__text = ""
        self.__span_tag = False
        return text

    def handle_starttag(self, tag, attrs):
        if tag == 'span':
            self.__span_tag = True
        return

    def handle_endtag(self, tag):
        if tag == 'span':
            self.__span_tag = False
        return

    def handle_startendtag(self, tag, attrs):
        return

    def handle_data(self, data):
        self.__text += data

    def handle_comment(self, data):
        return

    def handle_entityref(self, name):
        return

    def handle_charref(self, name):
        return
