'''
Created on Jul 7, 2014

@author: Alan Tai
'''
import webapp2
import jinja2
from webapp2_extras import auth, sessions


# jinja environment
jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader('static/templates'))

def user_required(handler):
    """ decorator that checks if the user exist """
    def check_login(self, *args, **kwargs):
        auth = self.auth
        if not auth.get_user_by_session():
            self.redirect(self.uri_for('login'), abort=True)
        else:
            return handler(self, *args, **kwargs)
        
    return check_login

def admin_required(handler):
    """ decorator that checks if the admin exist """
    def admin_login(self, *args, **kwargs):
        auth = self.auth
        if not auth.get_user_by_session():
            self.redirect('/auth/login', abort=True)
           
        user =  auth.get_user_by_session()
        if user and user['user_id'] == 5069036098420736:
            return handler(self, *args, **kwargs)
        else:
            self.redirect('/', abort = True)
        
    return admin_login


class BaseHandler(webapp2.RequestHandler):
    @webapp2.cached_property
    def auth(self):
        """ shortcut to access the auth instance """
        return auth.get_auth()
    
    @webapp2.cached_property
    def user_info(self):
        """ shortcut to access a subset of the user attributes """
        
        return self.auth.get_user_by_session()
    
    @webapp2.cached_property
    def user(self):
        """ shortcut to the current logged in user """
        u = self.user_info
        return self.user_model.get_by_id(u['user_id']) if u else None
    
    @webapp2.cached_property
    def user_model(self):
        """ return the implementation """
        
        return self.auth.store.user_model
    
    @webapp2.cached_property
    def session(self):
        """ shortcut """
        return self.session_store.get_session(backend='datastore')
    
    def render_template(self, view_filename, params=None):
        if not params:
            params = {}
        user = self.user_info
        params['user'] = user
        template = jinja_environment.get_template(view_filename)
        self.response.out.write(template.render(params))
        
    def display_message(self, message):
        """ utility function to display a template with a simple message """
        params = {
                  'message' : message
                  }
        self.render_template('/auth/message.html', params)
        
    # this is needed for webapp2 session to work
    def dispatch(self):
        # get a session store for this request
        self.session_store = sessions.get_store(request=self.request)
        
        try:
            # dispatch the request
            webapp2.RequestHandler.dispatch(self)
        finally:
            # save all session
            self.session_store.save_sessions(self.response)
            