class PagesController < ApplicationController
    def show
    end

    def login
        render "login"
    end

    def signUp
        render "signUp"
    end

    def home
        render "home"
    end

    def notifs
        render "notifs"
    end

    def messages
        render "messages"
    end

    def search
        render "search"
    end

    def profile
        render "profile"
    end

    def settings
        render "settings"
    end
end
