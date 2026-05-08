class CreateComplaints < ActiveRecord::Migration[8.1]
  def change
    create_table :complaints do |t|
      t.references :student,     null: false, foreign_key: { to_table: :users }
      t.references :assigned_to, null: true,  foreign_key: { to_table: :users }
      t.string  :category,        null: false, limit: 20
      t.string  :title,           null: false, limit: 120
      t.text    :description,     null: false
      t.string  :priority,        null: false, limit: 10
      t.string  :status,          null: false, default: "Submitted", limit: 15
      t.text    :resolution_note
      t.datetime :resolved_at

      t.timestamps
    end

    add_index :complaints, :status
  end
end