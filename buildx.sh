PLATFORMS=linux/amd64,linux/arm/v7,linux/arm64

source .env

docker buildx build \
  --platform ${PLATFORMS} \
  --build-arg REACT_APP_INFURA_API_KEY=${INFURA_API_KEY} \
  -t vbstreetz/signatory-client:latest \
  -f DockerfileRelease \
  --push \
  .
