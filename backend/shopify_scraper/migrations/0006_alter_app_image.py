# Generated by Django 4.1.5 on 2023-02-09 10:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shopify_scraper', '0005_app_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='app',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='images/app_icons/'),
        ),
    ]
