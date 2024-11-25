# Generated by Django 4.2.5 on 2024-11-21 12:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='LeaveRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('leave_type', models.CharField(choices=[('Sick Leave', 'Sick Leave'), ('Casual Leave', 'Casual Leave'), ('Paid Leave', 'Paid Leave'), ('Unpaid Leave', 'Unpaid Leave'), ('Maternity Leave', 'Maternity Leave'), ('Earned Leave', 'Earned Leave')], max_length=20)),
                ('start_date', models.DateField(default=django.utils.timezone.now)),
                ('end_date', models.DateField(default=django.utils.timezone.now)),
                ('reason', models.TextField()),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending', max_length=10)),
                ('submission_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='leave_application', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
