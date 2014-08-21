# -*- coding:utf-8 -*-
'''
Created on Jun 29, 2014

@author: Alan Tai
'''
__author__ = 'Alan Tai'


from google.appengine.ext import ndb
import webapp2_extras.appengine.auth.models
import time
from webapp2_extras import security


#webapp2 Oauth2Clients
class User(webapp2_extras.appengine.auth.models.User):
    def set_password(self, raw_password):
        """ set the password for current user; the raw password will be hashed and stored """
        self.password = security.generate_password_hash(raw_password, length=12)
        
    @classmethod
    def get_by_auth_token(cls, user_id, token, subject = 'auth'):
        """ return a user object on a user ID and token """
        
        token_key = cls.token_model.get_key(user_id, subject, token)
        user_key = ndb.Key(cls, user_id)
        
        # Use gt_multi to save a RPC call
        valid_token, user = ndb.get_multi([token_key, user_key])
        if valid_token and user:
            timestamp = int(time.mktime(valid_token.created.timetuple()))
            return user, timestamp
        
        return None, None
