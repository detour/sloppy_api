require 'httparty'

class GLanguageDetector
  include HTTParty
  format :json
  
  def self.get_lang(text)
    retried_counter = 0
    max_retried_time = 3
    
    begin
      res = self.get("https://ajax.googleapis.com/ajax/services/language/detect?v=1.0&q=#{URI.escape(text)}")
      return res["responseData"]["language"]
    rescue
      if retried_counter < max_retried_time
        puts "retry"
        sleep(30*(1+retried_counter))
        retried_counter+=1
        retry
      else
        puts "give up"
      end
    end
  end
  
  def self.asian_language?(text)
    return ["zh-TW", "zh-CN", 'ja'].include? get_lang(text)
  end

  def self.detect(text)
    retried_counter = 0
    max_retried_time = 3
    
    api_key = API_KEYS[:google_api_token]
    begin
      url = "https://www.googleapis.com/language/translate/v2?key=#{api_key}&target=en&q=#{URI.escape(text)}"
      response = self.get(url)
      if response['error'].nil?
        return response['data']['translations'][0]['detectedSourceLanguage']
      else
        puts "Error code: #{response['error']['code']}"
        if response['error']['code'] == 503
          return 'en'
        end
      end
      
      #base_url = 'http://www.google.com/uds/GlangDetect?v=1.0&q='
      #url = base_url + CGI.escape(text)
      #response = self.get(url)
      #return response['responseData']['language']
    rescue
      if retried_counter < max_retried_time
        puts "retry"
        sleep(10*(1+retried_counter))
        retried_counter+=1
        retry
      else
        puts "give up"
      end
    end
  end
end