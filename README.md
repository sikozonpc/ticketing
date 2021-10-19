### Installation
Get and install `ingress-ngix` https://kubernetes.github.io/ingress-nginx/deploy/ .
(Note: If you're setting this project on the cloud, make sure to read the appropriate section of your cloud provider)

### Setup the secrets
To setup the kubernetes secrets:
```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=132
kubectl create secret generic node-env 
--from-literal=NODE_ENV='development'
kubectl create secret generic base-url --from-literal=BASE_URL=http://ingress-nginx-controller.ingress-nginx.svc.cluster.local

# Run if on cloud enviroment
kubectl create secret generic base-url --from-literal=BASE_URL={DOMAIN_NAME}
kubectl create secret generic node-env --from-literal=NODE_ENV='production'
```

```bash
# to install dev dependencies in all projects to work locally.
npm i
```

### Startup
```
npm i
skaffold dev
```

open chrome and type "thisisunsafe"


