from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    cpassword = serializers.CharField(write_only=True)  # Added password2 field

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'cpassword', 'first_name', 'last_name', 'is_manager']
        extra_kwargs = {
            'password': {'write_only': True},
            'cpassword': {'write_only': True},  # Added password2 field in extra_kwargs
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["cpassword"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        name_pattern = re.compile(r"^[A-Za-z]+$")

        first_name = attrs.get("first_name")
        if first_name is None or not first_name.strip():
            raise serializers.ValidationError(
                {"first_name": "First name cannot be empty or only spaces."}
            )
        if first_name and not name_pattern.match(first_name):
            raise serializers.ValidationError(
                {"first_name": "First name must contain only alphabetic characters."}
            )

        last_name = attrs.get("last_name")
        if last_name is None or not last_name.strip():
            raise serializers.ValidationError(
                {"last_name": "Last name cannot be empty or only spaces."}  # Corrected
            )
        if last_name and not name_pattern.match(last_name):
            raise serializers.ValidationError(
                {"last_name": "Last name must contain only alphabetic characters."}
            )

        return attrs

    def validate_password(self, value):
        if not value:
            raise serializers.ValidationError("Password is required.")
        return value

    def create(self, validated_data):
        # Pop the password and cpassword (we don't need cpassword to create the user)
        password = validated_data.pop('password')
        # Pop 'cpassword' field since it's not needed for the User model
        validated_data.pop('cpassword', None)

        # Create the user instance without saving to the database yet
        user = self.Meta.model(**validated_data)

        # Set and hash the password
        user.set_password(password)
        user.save()

        return user
