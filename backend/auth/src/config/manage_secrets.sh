kubectl create secret generic auth-env \
    --save-config --dry-run=client \
    --from-env-file=./.env.development \
    -o yaml | 
  kubectl apply -f -