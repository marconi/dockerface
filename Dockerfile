FROM ubuntu:14.04
ENV LANG en_US.utf8

# RUN mkdir /dockerface
COPY ./dist /dockerface
COPY ./entrypoint /

EXPOSE 8080
ENTRYPOINT ["/entrypoint"]
CMD ["./dockerface"]
