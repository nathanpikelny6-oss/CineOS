# Dockerfile for serving the static Oblivian site
# Uses nginx to serve the repository's static files at /usr/share/nginx/html
FROM nginx:stable-alpine

# Remove default nginx index
RUN rm -rf /usr/share/nginx/html/*

# Copy all repo files into the image (in Docker context you should build from repo root)
COPY . /usr/share/nginx/html/

# Expose default HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
