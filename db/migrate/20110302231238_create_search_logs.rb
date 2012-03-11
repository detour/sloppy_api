class CreateSearchLogs < ActiveRecord::Migration
  def self.up
    create_table :search_logs do |t|
      t.string :query
      t.string :messed_query
      t.string :query_ip

      t.timestamps
    end
  end

  def self.down
    drop_table :search_logs
  end
end
