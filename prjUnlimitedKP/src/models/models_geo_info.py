# -*- coding:utf-8 -*-
__author__ = 'Alan Tai'
'''
Created on Jun 29, 2014

@author: Alan Tai
'''

from google.appengine.ext import ndb
    
#new temp. model with album_link
class NewAlbumGeoInfo(ndb.Model):
    """ albums geo info properties; all properties can be also created dynamically """
    album_id = ndb.StringProperty()
    album_title = ndb.StringProperty()
    album_description = ndb.StringProperty(indexed = False)
    album_thumbnail = ndb.StringProperty()
    album_link = ndb.StringProperty()
    
    #lat and lng also can be replaced by GeoptProperty
    album_lat = ndb.FloatProperty()
    album_lng = ndb.FloatProperty()
    
    create_date_time = ndb.DateTimeProperty(auto_now_add = True)
    update_date_time = ndb.DateTimeProperty(auto_now = True)