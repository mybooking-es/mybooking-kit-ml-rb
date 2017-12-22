require 'sinatra'
require 'sinatra/multi_route'
require 'sinatra/partial'
require 'sinatra/r18n'
require 'ostruct'

configure do
  set :partial_template_engine, :erb
  set :common_locals,  {site_title: "Integración mybooking",
  						site_logo: "/img/logo.png"}
  set :default_locale, 'es'
  set :available_locales, %w{en it ca}
end

helpers do

  def extract_locale
    if params[:lang] and settings.available_locales.include?(params[:lang])
      session[:locale] = params[:lang]
    else
      session[:locale] = settings.default_locale  
    end  
  end

end 

#
# Filters to manage multi language site
#
before method: :get do
  
  extract_locale

end

before method: :post do
  
  extract_locale 

end

#
# Site front page 
#
get '/' do

  template = ERB.new File.read('./public/js/rent_search_form_full_v2.js')  
  script = template.result(binding)

  page = {title: t.front_end_reservation.home,
  	      variables: {},
  	      scripts_source: "<script type=\"text/javascript\">#{script}</script>"}	
  erb :rent_search_form_full_v2, 
      {locals: settings.common_locals.merge(page: OpenStruct.new(page))}
end

#
# Product selection page
#
 route :get, :post, ['/reserva/producto'] do

  @date_from = params['date_from']
  @time_from = params['time_from']
  @date_to = params['date_to']
  @time_to = params['time_to']
  @pickup_place = params['pickup_place']
  @return_place = params['return_place']
  @driver_under_age = ('on' == params['driver_under_age'])

  template = ERB.new File.read('./public/js/rent_reservation_choose_product.js') 	
  script = template.result(binding)

  page = {title: t.front_end_reservation.choose_product_page_title,
  	      variables: {},
  	      scripts_source: "<script type=\"text/javascript\">#{script}</script>"}	
  erb :rent_reservation_choose_product, 
      {locals: settings.common_locals.merge(page: OpenStruct.new(page))}
end

#
# Complete reservation page
#
get '/reserva/completar' do
	
  template = ERB.new File.read('./public/js/rent_reservation_complete.js')  
  script = template.result(binding)

  page = {title: t.front_end_reservation.complete_reservation_page_title,
  	      variables: {},
  	      scripts_source: "<script type=\"text/javascript\">#{script}</script>"}	
  erb :rent_reservation_complete,
      {locals: settings.common_locals.merge(page: OpenStruct.new(page))}

end

#
# Show reservation page
#
get '/reserva/summary' do
 
  @booking_free_access_id = ''
  
  template = ERB.new File.read('./public/js/rent_reservation_summary.js')  
  script = template.result(binding)

  page = {title: t.front_end_reservation.summary_page_title,
          variables: {},
          scripts_source: "<script type=\"text/javascript\">#{script}</script>"}  
  
  erb :rent_reservation_summary,
      {locals: settings.common_locals.merge(page: OpenStruct.new(page))}

end

#
# Show reservation page
#
get '/reserva/:id' do
 
  @booking_free_access_id = params[:id]
  
  template = ERB.new File.read('./public/js/rent_reservation_summary.js')  
  script = template.result(binding)

  page = {title: t.front_end_reservation.summary_page_title,
  	      variables: {},
  	      scripts_source: "<script type=\"text/javascript\">#{script}</script>"}	
  
  erb :rent_reservation_summary,
      {locals: settings.common_locals.merge(page: OpenStruct.new(page))}

end

#
# Renting conditions
#
get '/condiciones' do

  page = {title: t.front_end_reservation.conditions_page_title,
          variables: {}}

  erb :renting_conditions,
      {locals: settings.common_locals.merge(page: OpenStruct.new(page))}
end

#
# Contact
#
get '/contacto' do

  page = {title: t.front_end_reservation.titles.contact_page_title,
          variables: {}}

  erb :contact,
      {layout: :layout_map, locals: settings.common_locals.merge(page: OpenStruct.new(page))}
end