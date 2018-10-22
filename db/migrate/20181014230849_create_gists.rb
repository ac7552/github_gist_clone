class CreateGists < ActiveRecord::Migration[5.2]
  def change
    create_table :gists do |t|
      t.string :description
      t.boolean :public
    end
  end
end
