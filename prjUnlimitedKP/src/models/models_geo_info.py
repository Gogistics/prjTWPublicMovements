# -*- coding:utf-8 -*-
'''
Created on Jun 29, 2014

@author: Alan Tai
'''
__author__ = 'Alan Tai'


from google.appengine.ext import ndb

class AlbumGeoInfo(ndb.Model):
    id = ndb.StringProperty()
    title = ndb.StringProperty()
    description = ndb.StringProperty()
    
    #lat and lng also can be replaced by GeoptProperty
    lat = ndb.FloatProperty()
    lng = ndb.FloatProperty()