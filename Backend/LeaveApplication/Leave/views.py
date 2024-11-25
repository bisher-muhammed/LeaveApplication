from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status

from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.views import View
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.utils.timezone import localtime
from accounts.models import User




from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from . Permissions import IsAdmin

class LeaveRequestCreateView(generics.CreateAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Get the employee (user) making the leave request
        employee = self.request.user
        
        # Retrieve start_date and end_date from the validated data of the serializer
        start_date = serializer.validated_data['start_date']
        end_date = serializer.validated_data['end_date']
        
        # Check if the employee already has a leave request during this period
        if LeaveRequest.objects.filter(
            employee=employee,
            start_date__lte=end_date,
            end_date__gte=start_date
        ).exists():
            raise ValidationError("You already have a leave request during this period.")
        
        # Save the leave request with the employee information
        serializer.save(employee=employee)

    def create(self, request, *args, **kwargs):
        """
        Override the default create method to include custom validation or error handling.
        """
        serializer = self.get_serializer(data=request.data)
        
        # Validate and raise exceptions if there are any errors
        serializer.is_valid(raise_exception=True)
        
        # Proceed with saving the leave request
        self.perform_create(serializer)

        # Custom success response
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                "message": "Leave request created successfully",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class LeaveTypeChoicesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Return the leave type choices dynamically.
        """
        leave_types = [
            {"value": choice[0], "label": choice[1]}
            for choice in LeaveRequest.LEAVE_TYPE_CHOICES
        ]
        return Response({"leave_types": leave_types})
    


# API view to list the leave history for the current user (employee)
class LeaveHistoryView(generics.ListAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    # Override the queryset to filter by the current user
    def get_queryset(self):
        return self.queryset.filter(employee=self.request.user)

# API view to list all pending leave requests for the manager to review
class LeaveRequestListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated,IsAdmin]
    queryset = LeaveRequest.objects.filter(status='pending')
    serializer_class = LeaveRequestSerializer



class UpdateLeaveStatus(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]  # Assumes IsAdmin is a custom permission
    serializer_class = LeaveRequestSerializer

    def patch(self, request, leave_id):
        # Ensure the user has admin/superuser privileges
        if not request.user.is_manager:
            return Response(
                {"error": "You do not have permission to update leave status."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Get the leave request object
        leave_request = get_object_or_404(LeaveRequest, id=leave_id)

        # Get the new status from the request data
        new_status = request.data.get('status')

        # Validate the new status
        valid_statuses = dict(LeaveRequest.STATUS_CHOICES).keys()
        if new_status not in valid_statuses:
            return Response(
                {"error": f"Invalid status. Valid options are: {', '.join(valid_statuses)}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update the status
        leave_request.status = new_status
        leave_request.save()

        # Return a success response with updated data
        return Response(
            {
                "message": "Leave status updated successfully.",
                "leave_request": LeaveRequestSerializer(leave_request).data,
            },
            status=status.HTTP_200_OK,
        )



    
class LeaveStatusChoicesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated,IsAdmin]

    def get(self, request, *args, **kwargs):
        """
        Return the leave type choices dynamically.
        """
        leave_status = [
            {"value": choice[0], "label": choice[1]}
            for choice in LeaveRequest.STATUS_CHOICES
        ]
        return Response({"leave_status": leave_status})


#View for generating a leave report for the manager (superuser)

# View for generating a leave report for the manager (superuser)
class ManagerLeaveReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Ensure the user is a manager or superuser
        if not (request.user.is_manager or request.user.is_superuser):
            return JsonResponse({"error": "Permission denied"}, status=403)
        
        # Fetch all leave requests
        leave_requests = LeaveRequest.objects.all()
        
        # Generate report data
        report_data = [
            {
                "employee": f"{leave.employee.first_name} {leave.employee.last_name}",
                "leave_type": leave.leave_type,
                "start_date": leave.start_date.strftime("%Y-%m-%d"),  # Format start_date as a string
                "end_date": leave.end_date.strftime("%Y-%m-%d"),      # Format end_date as a string
                "reason": leave.reason,
                "status": leave.status,
                "submission_date": localtime(leave.submission_date).strftime("%Y-%m-%d %H:%M:%S"),  # Format submission_date
            }
            for leave in leave_requests
        ]
        
        return JsonResponse({"report": report_data}, status=200)


class EmployeeLeaveReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        leave_requests = LeaveRequest.objects.filter(employee=request.user)
        serializer = LeaveRequestSerializer(leave_requests, many=True)
        return Response({"report": serializer.data}, status=200)


# API view to list all leave requests for a manager (admin or superuser)
class ManagerLeaveHistoryView(generics.ListAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    # Return all leave requests for the manager view
    def get_queryset(self):
        return LeaveRequest.objects.all()



class CancelLeaveView(generics.UpdateAPIView):
    queryset = LeaveRequest.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = LeaveRequestSerializer

    def update(self, request, *args, **kwargs):
        # Extract the leave request ID from the request body
        leave_request_id = request.data.get("id")

        try:
            # Get the leave request instance by ID
            leave_request = self.get_queryset().get(id=leave_request_id)

            # Update the status of the leave request to 'cancelled'
            leave_request.status = "cancelled"
            leave_request.save()

            # Serialize the updated leave request and return the response
            serializer = self.get_serializer(leave_request)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except LeaveRequest.DoesNotExist:
            # Return a 404 response if the leave request is not found
            return Response(
                {"detail": "Leave request not found."}, status=status.HTTP_404_NOT_FOUND
            )
        
