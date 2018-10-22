class AddGistToGistFiles < ActiveRecord::Migration[5.2]
  def change
    add_reference :gist_files, :gist, foreign_key: true
  end
end
