class Api::V1::AuthController < ApplicationController
  def login
    user = User.find_by(username: params[:username])

    # Check the password first so account status is never revealed to
    # someone who doesn't know the password.
    unless user&.authenticate(params[:password])
      return render json: { error: "Invalid username or password" },
                    status: :unauthorized
    end

    unless user.approved?
      return render json: { error: not_approved_message(user), status: user.status },
                    status: :forbidden
    end

    render json: {
      token: generate_token(user),
      user: {
        id:       user.id,
        username: user.username,
        fullname: user.fullname,
        role:     user.role
      }
    }, status: :ok
  end

  private

  def not_approved_message(user)
    if user.rejected?
      "Your registration was not approved. Please contact an administrator."
    else
      "Your account is awaiting admin approval. You can sign in once it is approved."
    end
  end

  def generate_token(user)
    payload = {
      user_id: user.id,
      role:    user.role,
      exp:     24.hours.from_now.to_i
    }
    JWT.encode(payload, SECRET, "HS256")
  end
end