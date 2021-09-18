FROM 172.16.11.205:8001/tmpimgs/nginx:1.19

WORKDIR /app
ADD dist/ /app/html

EXPOSE 8000
