# syntax=docker/dockerfile:1
FROM golang:1.20 AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o /digbot


FROM gcr.io/distroless/base-debian11 AS build-release-stage

WORKDIR /

COPY --from=build /digbot /digbot

VOLUME /data

USER nonroot:nonroot

ENTRYPOINT ["/digbot"]
