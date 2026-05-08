class ApplicationController < ActionController::API
  SECRET = ENV.fetch("SECRET_KEY_BASE")

  # Call this in any controller to require a logged-in user
  def authenticate_user!
    token   = request.headers["Authorization"]&.split(" ")&.last
    payload = JWT.decode(token, SECRET, true, algorithm: "HS256").first
    @current_user = User.find(payload["user_id"])
  rescue JWT::DecodeError, JWT::ExpiredSignature, ActiveRecord::RecordNotFound
    render json: { error: "Unauthorized" }, status: :unauthorized
  end

  # Call this to restrict an action to specific roles
  def require_role!(*roles)
    unless roles.include?(@current_user.role)
      render json: { error: "Forbidden" }, status: :forbidden
    end
  end

  def current_user
    @current_user
  end
end