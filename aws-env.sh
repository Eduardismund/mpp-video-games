#!/bin/bash
# Define your region or default region
export AWS_DEFAULT_REGION=eu-central-1
export AWS_REGION=eu-central-1
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity | jq -r .Account)
# We define the Registy URI based on the region and account ID
export REGISTRY_URI=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION:-$AWS_DEFAULT_REGION}.amazonaws.com/
