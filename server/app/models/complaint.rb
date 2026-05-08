class Complaint < ApplicationRecord
  belongs_to :student,     class_name: "User", foreign_key: :student_id
  belongs_to :assigned_to, class_name: "User", foreign_key: :assigned_to_id,
                           optional: true

  CATEGORIES = %w[Classroom Hostel Lab Security Cafeteria Library].freeze
  PRIORITIES = %w[High Medium Low].freeze
  STATUSES   = ["Submitted", "In Progress", "Resolved"].freeze

  validates :category,    presence: true, inclusion: { in: CATEGORIES }
  validates :priority,    presence: true, inclusion: { in: PRIORITIES }
  validates :status,      presence: true, inclusion: { in: STATUSES }
  validates :title,       presence: true, length: { minimum: 5, maximum: 120 }
  validates :description, presence: true, length: { minimum: 10 }

  # Scopes — reusable query building blocks
  scope :submitted,   -> { where(status: "Submitted") }
  scope :in_progress, -> { where(status: "In Progress") }
  scope :resolved,    -> { where(status: "Resolved") }
  scope :recent,      -> { order(created_at: :desc) }
  scope :by_status,   ->(s) { s.present? ? where(status: s) : all }
  scope :by_category, ->(c) { c.present? ? where(category: c) : all }
end