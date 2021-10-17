### Installation
Get and install `ingress-ngix` https://kubernetes.github.io/ingress-nginx/deploy/ .

### Setup the secrets
To setup the kubernetes secrets:
```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=132
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
