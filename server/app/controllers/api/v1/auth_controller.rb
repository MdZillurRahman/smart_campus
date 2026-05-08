class Api::V1::AuthController < ApplicationController
  def login
    user = User.find_by(username: params[:username])

    if user&.authenticate(params[:password])
      token = generate_token(user)
      render json: {
        token: token,
        user: {
          id:       user.id,
          username: user.username,
          fullname: user.fullname,
          role:     user.role
        }
      }, status: :ok
    else
      render json: { error: "Invalid username or password" }, status: :unauthorized
    end
  end

  private

  def generate_token(user)
    payload = {
      user_id: user.id,
      role:    user.role,
      exp:     24.hours.from_now.to_i
    }
    JWT.encode(payload, SECRET, "HS256")
  end
end