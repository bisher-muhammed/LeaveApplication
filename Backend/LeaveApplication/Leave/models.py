from django.db import models
from accounts.models import User
from django.utils import timezone


class LeaveRequest(models.Model):

    LEAVE_TYPE_CHOICES = [
        ('Sick Leave', 'Sick Leave'),
        ('Casual Leave', 'Casual Leave'),
        ('Paid Leave', 'Paid Leave'),
        ('Unpaid Leave', 'Unpaid Leave'),
        ('Maternity Leave', 'Maternity Leave'),
        ('Earned Leave', 'Earned Leave'),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ('cancelled','Cancelled')
    ]

    employee = models.ForeignKey(User,on_delete=models.CASCADE,related_name="leave_application")
    leave_type = models.CharField(max_length=20,choices=LEAVE_TYPE_CHOICES)
    start_date = models.DateField (default=timezone.now)
    end_date = models.DateField(default=timezone.now)
    reason = models.TextField()
    status = models.CharField(max_length=10,choices=STATUS_CHOICES,default='pending')
    submission_date = models.DateTimeField(default=timezone.now)


    def leave_duration(self):
        return(self.end_date-self.start_date).days +1


    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - {self.leave_type} ({self.status})"




