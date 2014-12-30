# -*- coding: utf-8 -*-
'''
Created on Jun 24, 2014

@author: Alan Tai
'''
__author__ = 'Alan Tai'

from google.appengine.ext import ndb

class VideoInfo(ndb.Model):
    id = ndb.StringProperty()
    sys_id = ndb.StringProperty()
    title = ndb.StringProperty()
    description = ndb.StringProperty()
    publishedAt = ndb.StringProperty()
    thumbnails = ndb.JsonProperty()