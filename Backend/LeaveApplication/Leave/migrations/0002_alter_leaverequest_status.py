# Generated by Django 4.2.5 on 2024-11-24 13:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Leave', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='leaverequest',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected'), ('cancelled', 'Cancelled')], default='pending', max_length=10),
        ),
    ]
