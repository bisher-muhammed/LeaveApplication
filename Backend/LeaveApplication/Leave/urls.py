from django.urls import path
from .views import *

urlpatterns = [
    path('leave-requests/create/', LeaveRequestCreateView.as_view(), name='leave-request-create'),
    path('leave-requests/types/', LeaveTypeChoicesView.as_view(), name="leave-types"),
    path('leave-requests/leave-lists/',LeaveRequestListView.as_view(),name="leave-lists"),
    path('leave-requests/<int:leave_id>/update-status/',UpdateLeaveStatus.as_view(),name="leave-status"),
    path('leave-requests/choices/',LeaveStatusChoicesView.as_view(),name='status-options'),
    path('leave-requests/leave-history',LeaveHistoryView.as_view(),name='leave-history'),
    path('leave-requests/leave-reports/',ManagerLeaveReportView.as_view(),name='leave-report'),
    path('leave-requests/employee-report/',EmployeeLeaveReportView.as_view(),name='employee-reports'),
    path('leave-requests/manager-leave-history/',ManagerLeaveHistoryView.as_view(),name='manager-history'),
    path('leave-requests/cancel-leave/',CancelLeaveView.as_view(),name='cancel-leave')
    

]
