class CreateGistFile < ActiveRecord::Migration[5.2]
  def change
    create_table :gist_files do |t|
      t.string :extension_type
      t.text :file_content
    end
  end
end
