API_KEYS = {}

if File.exists?("#{Rails.root}/config/api_keys.yml")
  api_keys = YAML.load_file("#{Rails.root}/config/api_keys.yml")
  API_KEYS[:google_api_token] = api_keys["google_api_token"]
else
  API_KEYS[:google_api_token] = ENV['GOOGLE_API_KEY']
end