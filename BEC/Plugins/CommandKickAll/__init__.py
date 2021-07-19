'''
    File name: __init__.py
    Author: @Lewk_io for Hero Haven DayZ
    Date created: 18/07/2020
    Date last modified: 18/07/2020
    Version: 1.0.0
    V: 1.0.0
'''
from twisted.internet import task

class CommandKickAll:
    def __init__(self, instance):
        self.bec = instance

    def kick_all(self):
        print self.bec

def start(instance):
    CommandKickAll(instance)