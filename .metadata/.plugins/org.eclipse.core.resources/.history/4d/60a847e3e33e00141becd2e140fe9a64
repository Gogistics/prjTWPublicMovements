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
from dictionaries.dict_html_pages_reference import HtmlPagesReference
from handlers.handler_webapp2_extra_auth import BaseHandler

# dictionaries
dict_general = KeysVaulesGeneral()
dict_html_ref = HtmlPagesReference()


# jinja environment
jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader('static/templates'))

# dispatchers
class CollapsibleTreeDemoDispatcher(BaseHandler):
    def get(self):
        """ collpasible tree dispatcher """
        template_values = {}
        template_values.update({'title':u'柯文哲-MA柯P'})
        self.render_template('/base/articles_tree.html', template_values)

class BarsChartDemoDispatcher(BaseHandler):
    def get(self):
        """ collpasible tree dispatcher """
        template_values = {}
        template_values.update({'title':u'柯文哲-MA柯P'})
        self.render_template('/demos/bars_chart.html', template_values)
        
class StackBarsChartDemoDispatcher(BaseHandler):
    def get(self):
        """ collpasible tree dispatcher """
        template_values = {}
        template_values.update({'title':u'柯文哲-MA柯P'})
        self.render_template('/demos/stacked_bars_charts.html', template_values)
        
class SortableBarsChartDemoDispatcher(BaseHandler):
    def get(self):
        """ collpasible tree dispatcher """
        template_values = {}
        template_values.update({'title':u'柯文哲-MA柯P'})
        self.render_template('/demos/sortable_bars_chart.html', template_values)
        
class DashBoardDemoDispatcher(BaseHandler):
    def get(self):
        """ collpasible tree dispatcher """
        template_values = {}
        template_values.update({'title':u'柯文哲-MA柯P'})
        self.render_template('/demos/dash_board.html', template_values)

class FinancialBarsChartDispatcher(BaseHandler):
    def get(self):
        """ collpasible tree dispatcher """
        template_values = {}
        template_values.update({'title':u'柯文哲-MA柯P'})
        self.render_template('/demos/financial_bars_chart_credit.html', template_values)


# configuration
config = dict_general.config_setting

# app
app = webapp2.WSGIApplication([
    webapp2.Route(r'/demos/collapsible_tree_chart', CollapsibleTreeDemoDispatcher, name='collapsible_tree_chart'),
    webapp2.Route(r'/demos/line_chart', BarsChartDemoDispatcher, name='line_chart'),
    webapp2.Route(r'/demos/stacked_bars_charts', StackBarsChartDemoDispatcher, name='stacked_bars_charts'),
    webapp2.Route(r'/demos/sortable_bars_chart', SortableBarsChartDemoDispatcher, name='sortable_bars_chart'),
    webapp2.Route(r'/demos/dash_board_chart', DashBoardDemoDispatcher, name='dash_board_chart'),
    webapp2.Route(r'/demos/financial_bars_chart_credit', FinancialBarsChartDispatcher, name='dash_board_chart')
], debug=True, config=config)

# log
logging.getLogger().setLevel(logging.DEBUG) 
    
