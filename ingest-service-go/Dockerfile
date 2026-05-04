# Stage 1: Build the Go binary
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o engine .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/engine .
EXPOSE 8080
CMD ["./engine"]