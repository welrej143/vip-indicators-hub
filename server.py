#!/usr/bin/env python3
import http.server
import socketserver
import os
from urllib.parse import urlparse

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Handle admin route
        if path == '/admin' or path == '/admin/':
            self.path = '/admin.html'
        
        # Call the parent method to handle the request
        return super().do_GET()

PORT = 5000
Handler = CustomHTTPRequestHandler

with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Serving HTTP on 0.0.0.0 port {PORT} (http://0.0.0.0:{PORT}/) ...")
    httpd.serve_forever()