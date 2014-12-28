# -*- coding: utf-8 -*-
'''
Created on Dec 27, 2014

@author: alantai
'''
from google.appengine.ext import ndb

class ArticleInfo(ndb.Model):
    id = ndb.IntegerProperty()
    title = ndb.StringProperty()
    url = ndb.StringProperty()
    author = ndb.StringProperty()
    category_id = ndb.IntegerProperty()
    post_date = ndb.StringProperty()
    last_modify = ndb.StringProperty()
    content = ndb.TextProperty()
    plain_content = ndb.TextProperty()
    