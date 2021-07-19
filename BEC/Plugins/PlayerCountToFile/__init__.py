'''
    File name: __init__.py
    Author: @Lewk_io for Hero Haven DayZ
    Date created: 18/07/2020
    Date last modified: 18/07/2020
    Version: 1.0.0
    V: 1.0.0
'''
from twisted.internet import task

CONFIG = {
    'interval': 1,
    'base_message': '{players}'
}


class PlayerCountToFile:
    def __init__(self, instance):
        self.bec = instance
        self.player_count_task = task.LoopingCall(self.send_player_count)
        self.player_count_task.start(CONFIG.get('interval') * 60, False)

    def get_players(self):
        return self.bec.Bec_playersconnected

    def send_player_count(self):
        player_count = len(self.get_players())
        f = open('count.txt','w+')
        f.write(CONFIG.get('base_message').format(players=player_count))
        f.close()

def start(instance):
    PlayerCountToFile(instance)