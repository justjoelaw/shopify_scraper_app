# Generated by Django 4.1.5 on 2023-02-08 12:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shopify_scraper', '0003_job_last_run_timestamp_alter_job_app_alter_job_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='last_run_timestamp',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
