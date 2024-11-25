from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework import generics
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import RegisterSerializer, LoginSerializer, MyTokenObtainPairSerializer 
from .models import User

# Register View
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully!"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        """
        Handles user login and returns JWT tokens (access & refresh).
        """
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # After validation, get user from serializer
            user = serializer.validated_data['user']
            
            # Use the MyTokenObtainPairSerializer to get JWT tokens
            token = MyTokenObtainPairSerializer.get_token(user)
            
            # Return JWT tokens and user info
            return Response(
                {
                    "access": str(token.access_token),  # Access token
                    "refresh": str(token),  # Refresh token (token object as a whole)
                    "username": user.username,
                    "email": user.email,
                    "is_manager":user.is_manager
                },
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
    