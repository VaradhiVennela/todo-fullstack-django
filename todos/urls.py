from django.urls import path
from . import views

urlpatterns = [
    path('fbv/todos/', views.todo_list, name='todo_list'),
    path('fbv/todos/create/', views.todo_create, name='todo_create'),
    path('fbv/todos/<int:pk>/', views.todo_detail, name='todo_detail'),
]
