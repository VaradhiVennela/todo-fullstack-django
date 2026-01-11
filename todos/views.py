from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import Todo
from .serializers import TodoListSerializer, TodoDetailSerializer

@csrf_exempt
@api_view(['GET'])
def todo_list(request):
    """Retrieves the list from Admin to show on Frontend"""
    todos = Todo.objects.all()
    status_param = request.GET.get('status')
    if status_param is not None and status_param != "":
        is_completed = status_param.lower() == 'true' or status_param == '1'
        todos = todos.filter(status=is_completed)
    serializer = TodoListSerializer(todos, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
def todo_create(request):
    """Takes data from UI and saves it into Admin Panel"""
    serializer = TodoDetailSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def todo_detail(request, pk):
    """Handles viewing, updating, and deleting specific items"""
    todo = get_object_or_404(Todo, pk=pk)
    if request.method == 'GET':
        return Response(TodoDetailSerializer(todo).data)
    elif request.method == 'PUT':
        serializer = TodoDetailSerializer(todo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        todo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)