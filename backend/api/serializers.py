from rest_framework import serializers
from shopify_scraper.models import Review, Job, App

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class AppSerializer(serializers.ModelSerializer):
    class Meta:
        model = App
        fields = '__all__'

class JobWithAppSerializer(serializers.ModelSerializer):
    app = AppSerializer()

    class Meta:
        model = Job
        fields ='__all__'