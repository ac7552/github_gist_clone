class Gist < ActiveRecord::Base
   has_many :gist_files, dependent: :destroy
   accepts_nested_attributes_for :gist_files, :allow_destroy => true
end
