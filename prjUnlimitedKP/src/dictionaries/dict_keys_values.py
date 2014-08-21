# -*- coding: utf-8 -*-
'''
Created on May 22, 2014

@author: Alan Tai

@description:
dictionary for key-value pairs
'''

class KeysVaulesGeneral():
    """ keys values pairs """
    def __init__(self):
        self.brand_title = u'澎湖小男孩'
        self.website = 'http://wwww.penghuboy-tw.com'
        self.host_email = 'gogistics.tw@gmail.com'
        self.pengu_hu_boy_mobile_tw = '+886-972-849-980'
        
        # tokens
        self.token_front_page = 'front_page'
        self.token_index_page = 'index_page'
        self.token_customer_services_page = 'customer_services_page'
        
        #deliver time
        self.products = {'regular_mullet_fish_egg':'平裝版烏魚子', 'special_mullet_fish_egg':'精裝版烏魚子'}
        self.deliver_times = {'morning':'早上', 'afternoon':'下午', 'night':'晚上'}
        
        #webapp2 config
        self.config_setting = {
                               'webapp2_extras.auth': {'user_model': 'models.models_people.User','user_attributes': ['name']},
                               'webapp2_extras.sessions': {'secret_key': 'b4RiUekgAqFBOHSu2cNwOQGG'}  # secret key is just a combination of random character which is better to be unguessable; user can create whatever they want
                               }
        
# Chinese
class KeysValuesMandarin():
    def __init__(self):
        self.index_page_title = u'首頁'
        self.customer_services_page_title = u'客戶服務'
