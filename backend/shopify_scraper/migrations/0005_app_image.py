# Generated by Django 4.1.5 on 2023-02-09 10:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shopify_scraper', '0004_alter_job_last_run_timestamp'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='image',
            field=models.ImageField(default='', upload_to='images/app_icons/'),
            preserve_default=False,
        ),
    ]
