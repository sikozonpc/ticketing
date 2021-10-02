
### Startup
```
npm i
skaffold dev
```
### Secrets
To setup the kubernetes secrets:
```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=132
```

open chrome and type "thisisunsafe"
