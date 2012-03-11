class LayoutGenerator < Rails::Generators::Base  
  source_root File.expand_path('../templates', __FILE__)  
  argument :layout_name, :type => :string, :default => "application"  
  class_option :stylesheet, :type => :boolean, :default => true, :description => "Include stylesheet file"  
    
  def generate_layout  
    copy_file "base.css", "public/stylesheets/base.css" if options.stylesheet?  
    template "layout.html.erb", "app/views/layouts/#{file_name}.html.erb"  
  end  
    
  private  
  def file_name  
    layout_name.underscore  
  end  
    
end