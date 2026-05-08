class User < ApplicationRecord
  has_secure_password

  has_many :submitted_complaints,
           class_name: "Complaint",
           foreign_key: :student_id,
           dependent: :destroy

  has_many :assigned_complaints,
           class_name: "Complaint",
           foreign_key: :assigned_to_id,
           dependent: :nullify

  ROLES    = %w[student admin staff].freeze
  STATUSES = %w[pending approved rejected].freeze

  validates :username, presence: true,
                       uniqueness: { case_sensitive: false },
                       length: { minimum: 3, maximum: 50 }
  validates :email,    presence: true,
                       uniqueness: { case_sensitive: false },
                       format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :role,     presence: true, inclusion: { in: ROLES }
  validates :fullname, presence: true, length: { maximum: 120 }
  validates :status,   presence: true, inclusion: { in: STATUSES }

  # Role helpers
  def student?     = role == "student"
  def admin?       = role == "admin"
  def staff?       = role == "staff"
  def superadmin?  = role == "admin" && username == "superadmin"

  # Status helpers
  def approved?    = status == "approved"
  def pending?     = status == "pending"
  def rejected?    = status == "rejected"
end