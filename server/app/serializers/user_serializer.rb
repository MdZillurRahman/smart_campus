class UserSerializer
  include JSONAPI::Serializer

  attributes :username, :email, :fullname, :role, :status
end