# aws-nxp-ai-at-the-edge-credentials-setup #

User-friendly GUI to help setup AWS IoT Greengrass Core device credentials to a
[Toradex](https://www.toradex.com/) Computer on Module using the embedded Linux
[Torizon](https://www.toradex.com/operating-systems/torizon) platform.

# How to Use #

This software is part of the [AWS AI at the Edge Pasta Detection Demo](https://developer.toradex.com/knowledge-base/object-detection-demo-with-aws-sagemaker-neo-and-torizon)
designed to run on the [Apalis iMX8 Embedded Vision Kit with Allied Vision](https://developer.toradex.com/knowledge-base/apalis-imx8-embedded-vision-kit-with-allied-vision).

You can find additional information about this demonstration on the following
resources of the [Toradex developer website](https://developer.toradex.com/):

- How to use the demo and additional resources:
[AWS AI at the Edge Pasta Detection Demo](https://developer.toradex.com/knowledge-base/object-detection-demo-with-aws-sagemaker-neo-and-torizon)
- [Apalis iMX8 Embedded Vision Kit with Allied Vision](https://developer.toradex.com/knowledge-base/apalis-imx8-embedded-vision-kit-with-allied-vision)

# Developer Info #

The containerized app is meant to run in an embedded system with armv8 arch. The
Dockerfiles and docker-compose files are also provided for armv7 and x86-64, for
convenience. In particular, a specific file for development is provided for x86
`docker-compose-x86.dev.yml`.

## Project Bring-up for Development ##

Clone all [project repos](https://developer.toradex.com/knowledge-base/object-detection-demo-with-aws-sagemaker-neo-and-torizon#Next_Steps)
side-by-side. Enter the `aws-nxp-ai-at-the-edge-credentials-setup` directory and
use docker-compose to bring-up:

```
docker-compose -f docker-compose-x86.dev.yml up --force-recreate --always-recreate-deps
```

## Hints ##

The main files you'll want to edit are:

- back-end/index.js
- front-end/src/pages/Index.vue

Those files are bind-mount from your PC to the containers. They are also
hot-reloaded on changes. That means you just need to bring-up the container once
and then all changes are automatically applied every time you save them.