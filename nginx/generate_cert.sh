#!/bin/bash

CERT_DIR="/etc/nginx/certs"

# Generate SSL/TLS certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout "$CERT_DIR/ssl_certificate.key" -out "$CERT_DIR/ssl_certificate.crt" \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"

# Set file permissions
chmod 777 "$CERT_DIR/ssl_certificate.key"
chmod 777 "$CERT_DIR/ssl_certificate.crt"
