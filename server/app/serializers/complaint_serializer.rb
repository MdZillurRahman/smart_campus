class ComplaintSerializer
  include JSONAPI::Serializer

  attributes :title, :description, :category, :priority,
             :status, :resolution_note, :resolved_at, :created_at

  attribute :display_id do |complaint|
    "CMP#{complaint.id.to_s.rjust(3, '0')}"
  end

  attribute :student do |complaint|
    {
      id:       complaint.student.id,
      fullname: complaint.student.fullname,
      username: complaint.student.username
    }
  end

  attribute :assigned_to do |complaint|
    if complaint.assigned_to.present?
      {
        id:       complaint.assigned_to.id,
        fullname: complaint.assigned_to.fullname,
        username: complaint.assigned_to.username
      }
    end
  end
end