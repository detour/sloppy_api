class AddLangToSearchLogs < ActiveRecord::Migration
  def self.up
    add_column :search_logs, :lang, :string
  end

  def self.down
    remove_column :search_logs, :lang
  end
end
