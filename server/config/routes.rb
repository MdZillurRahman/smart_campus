Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Auth
      post "auth/login",  to: "auth#login"

      # Complaints
      resources :complaints, only: [:index, :show, :create] do
        member do
          patch :assign
          patch :resolve
          patch :reopen
        end
      end

      # Users (staff list for assign dropdown)
      resources :users, only: [:index]
    end
  end
end