from django.db import models

class Todo(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.BooleanField(default=False)
    due_date = models.DateField()

    def __str__(self):
        return self.title
