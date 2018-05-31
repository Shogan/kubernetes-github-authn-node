# node-kubernetes-github-authn

Kubernetes Webhook RBAC authentication service written in NodeJS to run as a daemon set across cluster master nodes.

- Handles RBAC authentication requests from K8s by checking if the user (token) is valid and exists for a user in Github with the username associated against any relevant Kubernetes rolebindings or clusterrolebinding mappings.

## Install and run local dev

- npm install (to install required npm packages)
- npm install -g nodemon (to install nodemon)
- nodemon (from the repo directory to launch node and invoke server.js) - this is better for local dev iteration than running ```node server.js``` as it will restart the app every time you make changes to files

## Docker image building

From the root directory of the project (i.e. where the .dockerignore file is, as well as server.js), run:

- docker build -t node-kubernetes-github-authn:{VERSION TAG} -f .\docker\Dockerfile .

This will build the Dockerfile in the context of the root project folder, so that the COPY command in the Dockerfile copies in the files from this level (locally).

## Docker run local dev

docker run node-kubernetes-github-authn:{VERSION TAG}/latest

## Pull image down from the public Docker registry

Pull the image down using: shoganator/node-kubernetes-github-authn

## AWS ECR push Docker images

If you want to build and push up to ECR (e.g. for private K8s clusters that don't have access to public docker registry) you can use the following:

- Invoke-Expression -Command (aws ecr get-login --no-include-email --region us-east-1)
- docker build -t node-kubernetes-github-authn -f .\docker\Dockerfile .
- docker tag node-kubernetes-github-authn:latest yourawsaccountnumber.dkr.ecr.us-east-1.amazonaws.com/node-kubernetes-github-authn:latest
- docker tag node-kubernetes-github-authn:{VERSION TAG} yourawsaccountnumber.dkr.ecr.us-east-1.amazonaws.com/node-kubernetes-github-authn:{VERSION TAG}
- docker push yourawsaccountnumber.dkr.ecr.us-east-1.amazonaws.com/node-kubernetes-github-authn:latest
- docker push yourawsaccountnumber.dkr.ecr.us-east-1.amazonaws.com/node-kubernetes-github-authn:{VERSION TAG}

## Container logging

Winston is configured to write logs to both the console of the container as well as to a rolling log file under /logs. Please ensure your docker container build includes the /logs directory.
