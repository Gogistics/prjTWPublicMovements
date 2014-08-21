# -*- coding: utf-8 -*-
'''
Created on Jun 24, 2014

@author: Alan Tai
'''
__author__ = 'Alan Tai'


import logging
import jinja2
import webapp2

from dictionaries.dict_keys_values import KeysVaulesGeneral
from handlers.handler_webapp2_extra_auth import BaseHandler

# dictionaries
dict_general = KeysVaulesGeneral()



# jinja environment
jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader('static/templates'))

# dispatchers
class BaseDispatcher(BaseHandler):
    def get(self):
        self.render_template('/base/index.html')
        
class AlbumsDispatcher(BaseHandler):
    def get(self):
        self.render_template('/base/album.html')
        
class VideosDispatcher(BaseHandler):
    def get(self):
        self.render_template('/base/video.html')

# configuration
config = dict_general.config_setting

# app
app = webapp2.WSGIApplication([
    webapp2.Route(r'/', BaseDispatcher, name='base'),
    webapp2.Route(r'/base/albums', AlbumsDispatcher, name='albums'),
    webapp2.Route(r'/base/videos', VideosDispatcher, name='videos')
], debug=True, config=config)

# log
logging.getLogger().setLevel(logging.DEBUG) 
    
