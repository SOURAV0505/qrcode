# Use Nginx to serve static files
FROM nginx:alpine

# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy your static files to Nginx html directory
COPY . /usr/share/nginx/html

# Expose port 3000 instead of default 80
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
