from rest_framework import serializers
from .models import LeaveRequest
from accounts.models import User


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = LeaveRequest
        fields = [
            "id",
            "employee",  # This will be automatically populated
            "employee_name",
            "leave_type",
            "start_date",
            "end_date",
            "reason",
            "status",
            "submission_date",
        ]
        read_only_fields = ('employee',)  # Automatically assign the employee (user) field.

    def get_employee_name(self, obj):
        """
        Return the full name of the employee (user).
        """
        return f"{obj.employee.first_name} {obj.employee.last_name}"
    
    def validate(self, data):
        """
        Validate leave request data, including:
        - Ensuring start_date and end_date are provided and valid.
        - Ensuring start_date is not after end_date.
        """
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if not start_date:
            raise serializers.ValidationError({"start_date": "Start date is required."})
        
        if not end_date:
            raise serializers.ValidationError({"end_date": "End date is required."})

        if start_date > end_date:
            raise serializers.ValidationError(
                {"end_date": "End date cannot be earlier than start date."}
            )

        # Additional validations (e.g., for overlapping leave requests) can be added here
        return data





class LeaveTypeChoicesSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()


