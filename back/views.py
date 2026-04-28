from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.views.generic import CreateView

# Create your views here.

def index(request):
    user = request.user
    print(user)
    return render(
        request,
        "back/index.html",
        { "user": user }
    )

@login_required
def profile(request):
    user = request.user
    return render(
        request,
        "back/profile.html",
        { "user": user },
    )

class SignUpView(CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'registration/signup.html'