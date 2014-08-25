# -*- coding: utf-8 -*-
'''
Created on Jun 24, 2014

@author: Alan Tai
'''
__author__ = 'Alan Tai'


import logging
import jinja2
import webapp2
import json

from dictionaries.dict_keys_values import KeysVaulesGeneral
from handlers.handler_webapp2_extra_auth import BaseHandler
from models.models_geo_info import AlbumGeoInfo
# dictionaries
dict_general = KeysVaulesGeneral()


# jinja environment
jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader('static/templates'))

# dispatchers
class AlbumsGeoInfoHandler(BaseHandler):
    def post(self):
        json_geo_data = json.loads(self.request.get('geo_data'))
        for key in json_geo_data.keys():
            new_geo_info = AlbumGeoInfo( id = key )
            new_geo_info.album_id = key
            new_geo_info.album_title = json_geo_data[key]['album_title']
            new_geo_info.album_description = json_geo_data[key]['album_description']
            new_geo_info.album_thumbnail = json_geo_data[key]['album_thumbnail']
            new_geo_info.album_lat = json_geo_data[key]['album_lat']
            new_geo_info.album_lng = json_geo_data[key]['album_lng']
            
            new_geo_info.put()
            
        
        # ajax response
        ajax_response = {'processing_status': 'success'}
        self.response.out.headers['Content-Type'] = 'text/json'
        self.response.out.write(json.dumps(ajax_response))

# configuration
config = dict_general.config_setting

# app
app = webapp2.WSGIApplication([
    webapp2.Route(r'/albums/geo_info_handler', AlbumsGeoInfoHandler, name='albums_geo_info_handler')
], debug=True, config=config)

# log
logging.getLogger().setLevel(logging.DEBUG) 
    
