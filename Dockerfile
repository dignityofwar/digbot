# syntax=docker/dockerfile:1
FROM golang:1.21 AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=1 GOOS=linux go build -o /digbot


FROM gcr.io/distroless/base-debian12 AS release

WORKDIR /

COPY --from=build /digbot /digbot

VOLUME /data

USER nonroot:nonroot

ENTRYPOINT ["/digbot"]
