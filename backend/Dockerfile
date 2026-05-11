FROM node:22-alpine AS vue-build-stage
WORKDIR /app/vue
COPY vue/package*.json ./
RUN npm ci
RUN npm run build

FROM python:3.14 AS django-build-stage

WORKDIR /app

RUN pip install --upgrade pip
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app
RUN ln -s /app/vue/dist/ /app/back/static/vue

EXPOSE 8000
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]