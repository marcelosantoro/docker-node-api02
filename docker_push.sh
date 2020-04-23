#!/bin/bash -e

# IT WORKS ;)

# Parameters
REGISTRY_URL=${AWS_ACCOUNT_ID}.dkr.ecr.${EB_REGION}.amazonaws.com
SOURCE_IMAGE="${DOCKER_REPO}"
TARGET_IMAGE="${REGISTRY_URL}/${DOCKER_REPO}"
TARGET_IMAGE_LATEST="${TARGET_IMAGE}:latest"
TIMESTAMP=$(date '+%Y%m%d%H%M%S')
VERSION="${TIMESTAMP}-${TRAVIS_COMMIT}"
TARGET_IMAGE_VERSIONED="${TARGET_IMAGE}:${VERSION}"

# Configure Region
aws configure set default.region ${EB_REGION}

# Push image to ECR
###################

# Login AWS
$(aws ecr get-login --no-include-email)

# update latest version
docker tag ${SOURCE_IMAGE} ${TARGET_IMAGE_LATEST}
docker push ${TARGET_IMAGE_LATEST}

# push new version
docker tag ${SOURCE_IMAGE} ${TARGET_IMAGE_VERSIONED}
docker push ${TARGET_IMAGE_VERSIONED}