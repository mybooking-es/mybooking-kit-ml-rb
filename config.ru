require './app.rb'

use Rack::Session::Cookie, :secret => 'test'

run Sinatra::Application