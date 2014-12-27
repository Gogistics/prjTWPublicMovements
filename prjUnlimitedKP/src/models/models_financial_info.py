# -*- coding:utf-8 -*-
'''
Created on Dec 26, 2014

@author: alantai
'''
from google.appengine.ext import ndb

class FinancialData(ndb.Model):
    start_date = ndb.StringProperty()
    label = ndb.StringProperty()
    price = ndb.IntegerProperty()
    start_timestamp = ndb.IntegerProperty()
    end_timestamp = ndb.IntegerProperty()
    account = ndb.StringProperty()
    type = ndb.StringProperty()