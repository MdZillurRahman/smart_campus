class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    require_role!("admin")
    return if performed?

    users = User.where(role: params[:role], status: "approved")
    render json: UserSerializer.new(users).serializable_hash
  end

  def pending
    require_role!("admin")
    return if performed?

    users = User.where(status: "pending")
    render json: UserSerializer.new(users).serializable_hash
  end

  def approve
    require_role!("admin")
    return if performed?

    user = User.find(params[:id])

    if user.update(status: "approved")
      render json: UserSerializer.new(user).serializable_hash
    else
      render json: { errors: user.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def reject
    require_role!("admin")
    return if performed?

    user = User.find(params[:id])

    if user.update(status: "rejected")
      render json: UserSerializer.new(user).serializable_hash
    else
      render json: { errors: user.errors.full_messages },
             status: :unprocessable_entity
    end
  end
end