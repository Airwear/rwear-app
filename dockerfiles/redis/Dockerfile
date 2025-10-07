FROM redis/redis-stack-server:latest

ARG USER=locabu
ARG STORAGE_DIR=data

ENV TAG PIM_LOCABU
ENV REDIS_PASSWORD tanou
ENV REDIS_HOST 127.0.0.1

RUN groupadd -r $USER && useradd -r -g $USER $USER

COPY ./redis.conf /etc/redis-stack.conf

EXPOSE 6379:6379

VOLUME $STORAGE_DIR:/data

USER $USER

