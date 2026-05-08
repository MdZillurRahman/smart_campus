Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Auth
      post "auth/login",    to: "auth#login"
      post "auth/register", to: "registrations#create"

      # Complaints
      resources :complaints, only: [:index, :show, :create] do
        member do
          patch :assign
          patch :resolve
          patch :reopen
        end
      end

      # Users
      resources :users, only: [:index] do
        collection do
          get :pending
        end
        member do
          patch :approve
          patch :reject
        end
      end
    end
  end
end