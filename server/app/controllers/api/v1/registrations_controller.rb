class Api::V1::RegistrationsController < ApplicationController
  def create
    user = User.new(registration_params)

    # Core hybrid logic — students are auto-approved
    user.status = user.student? ? "approved" : "pending"

    if user.save
      if user.approved?
        token = generate_token(user)
        render json: {
          message: "Registration successful.",
          token: token,
          user: {
            id:       user.id,
            username: user.username,
            fullname: user.fullname,
            role:     user.role,
            status:   user.status
          }
        }, status: :created
      else
        render json: {
          message: "Registration received. Awaiting admin approval.",
          status: "pending"
        }, status: :created
      end
    else
      render json: { errors: user.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  private

  def registration_params
    # Note: status is NOT permitted — always set server-side
    params.require(:user).permit(:username, :email, :password,
                                 :password_confirmation, :fullname, :role)
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