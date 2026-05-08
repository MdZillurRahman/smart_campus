class Api::V1::ComplaintsController < ApplicationController
  before_action :authenticate_user!

  def index
    complaints = case current_user.role
                 when "student" then current_user.submitted_complaints
                 when "staff"   then current_user.assigned_complaints
                 when "admin"   then Complaint.all
                 end

    complaints = complaints
                   .by_status(params[:status])
                   .by_category(params[:category])
                   .recent
                   .includes(:student, :assigned_to)

    render json: ComplaintSerializer.new(complaints).serializable_hash
  end

  def show
    complaint = find_complaint
    return unless complaint

    render json: ComplaintSerializer.new(complaint).serializable_hash
  end

  def create
    require_role!("student")
    return if performed?

    complaint = current_user.submitted_complaints.build(complaint_params)

    if complaint.save
      render json: ComplaintSerializer.new(complaint).serializable_hash,
             status: :created
    else
      render json: { errors: complaint.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def assign
    require_role!("admin")
    return if performed?

    complaint = Complaint.find(params[:id])
    staff = User.find_by(id: params[:assigned_to_id])

    unless staff&.staff?
      return render json: { error: "Invalid staff member" },
                    status: :unprocessable_entity
    end

    if complaint.update(assigned_to: staff, status: "In Progress")
      render json: ComplaintSerializer.new(complaint).serializable_hash
    else
      render json: { errors: complaint.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def resolve
    require_role!("admin", "staff")
    return if performed?

    complaint = Complaint.find(params[:id])

    if current_user.staff? && complaint.assigned_to_id != current_user.id
      return render json: { error: "You can only resolve your own assigned complaints" },
                    status: :forbidden
    end

    if complaint.update(
      status: "Resolved",
      resolution_note: params[:resolution_note],
      resolved_at: Time.current
    )
      render json: ComplaintSerializer.new(complaint).serializable_hash
    else
      render json: { errors: complaint.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def reopen
    require_role!("admin")
    return if performed?

    complaint = Complaint.find(params[:id])

    if complaint.update(
      status: "Submitted",
      assigned_to: nil,
      resolution_note: nil,
      resolved_at: nil
    )
      render json: ComplaintSerializer.new(complaint).serializable_hash
    else
      render json: { errors: complaint.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  private

  def find_complaint
    complaint = case current_user.role
                when "student" then current_user.submitted_complaints.find_by(id: params[:id])
                when "staff"   then current_user.assigned_complaints.find_by(id: params[:id])
                when "admin"   then Complaint.find_by(id: params[:id])
                end

    unless complaint
      render json: { error: "Complaint not found" }, status: :not_found
    end

    complaint
  end

  def complaint_params
    params.require(:complaint).permit(:category, :title, :description, :priority)
  end
end