class HotSearch < ActiveRecord::Base
  
  def self.hot_queries_on(date=Date.today)
    SearchLog.find_hot_searches_on(date)
  end
end
