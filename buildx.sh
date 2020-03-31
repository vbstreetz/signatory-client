PLATFORMS=linux/amd64,linux/arm/v7,linux/arm64

source .env

docker buildx build \
  --platform ${PLATFORMS} \
  --tag vbstreetz/signatory-client:latest \
  --file ./DockerfileRelease \
  --push \
  ./
