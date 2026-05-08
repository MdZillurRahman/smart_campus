class AddStatusToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :status, :string, null: false, default: "pending"
    add_index  :users, :status
  end
end