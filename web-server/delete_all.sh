#!/usr/bin/env bash

kubectl delete service web-service
kubectl delete configmap web-nginx-conf
kubectl delete deployment web-deployment
