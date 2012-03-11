class CreateHotSearches < ActiveRecord::Migration
  def self.up
    create_table :hot_searches do |t|
      t.text :content

      t.timestamps
    end
  end

  def self.down
    drop_table :hot_searches
  end
end
