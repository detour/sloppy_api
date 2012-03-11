namespace :search_log do
  desc "update search_log language"
  task :update_lang => :environment do    
    SearchLog.where(:lang => nil).find_in_batches do |slogs|
      slogs.each do |slog|
        slog.lang = GLanguageDetector.detect(slog.query)
        slog.save
        puts "== ID: #{slog.id}, Query: #{slog.query}, Lang: #{slog.lang}"
      end
    end
  end
  
  desc "propagate search_log lang"
  task :propagate_lang => :environment do
    SearchLog.where("lang IS NOT NULL").find_in_batches do |slogs|
      slogs.each do |slog|
        matched_logs = SearchLog.where(:lang => nil, :query => slog.query)
        matched_logs.each do |mlog|
          mlog.lang = slog.lang
          mlog.save
          puts "== ID: #{mlog.id}, Query: #{mlog.query}, Lang: #{mlog.lang}"
        end
      end
    end
  end
end