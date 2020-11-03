FROM lnl7/nix:2020-06-07

COPY shell.nix .
RUN nix-shell

RUN mkdir -p /project
WORKDIR /project

CMD ["nix-shell"]
