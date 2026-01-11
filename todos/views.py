from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from django.shortcuts import get_object_or_404
from .models import Todo
from .serializers import TodoListSerializer, TodoDetailSerializer

@api_view(['GET'])
def todo_list(request):
    todos = Todo.objects.all()
    status_param = request.GET.get('status')
    if status_param is not None:
        todos = todos.filter(status=bool(int(status_param)))
    serializer = TodoListSerializer(todos, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def todo_create(request):
    serializer = TodoDetailSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def todo_detail(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    if request.method == 'GET':
        serializer = TodoDetailSerializer(todo)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = TodoDetailSerializer(todo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        todo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
