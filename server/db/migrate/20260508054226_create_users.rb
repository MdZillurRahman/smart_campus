class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :username,        null: false, limit: 50
      t.string :email,           null: false, limit: 120
      t.string :password_digest, null: false
      t.string :role,            null: false
      t.string :fullname,        null: false, limit: 120

      t.timestamps
    end

    add_index :users, :username, unique: true
    add_index :users, :email,    unique: true
    add_index :users, :role
  end
end