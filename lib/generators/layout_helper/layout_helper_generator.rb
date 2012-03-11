class LayoutHelperGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('../templates', __FILE__)
  
  def generate_layout  
    copy_file "layout_helper.rb", "app/helpers/layout_helper.rb"  
  end
end
