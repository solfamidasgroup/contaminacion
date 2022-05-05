# contaminacion

Scripts y notebooks realizados para el desarrollo de una interfaz web para el monitoreo y prediccion de la calidad del aire en Madrid.

Tecnologias utilizadas:
  1. Python (Pandas, Prophet)
  2. InfluxDB
  3. Grafana
  4. Flask, Nginx, Gunicorn
  5. Kubernetes (Minikube, EKS)
  6. Docker
  
  
Explicacion carpetas y scripts:

  1. cron:
  
  Serie de scripts que estan pensados para ser lanzados como una tarea. Los scripts se encuentran alojados en una maquina virtual EC2 de AWS que se encuentra operativa las 24 horas y mediante un cronjob se ejecutaban de forma automatica.
  
    datos_horarios.py : Script de python que se ejecuta cada hora cuyo objetivo es guardar los datos a tiempo real de la contaminacion de Madrid en nuestra base de datos.
    
    modelo_diario.py : Script de python que se ejecuta de forma automatica cada dia a las 00:00. Su objetivo es predecir los niveles de calidad del aire del dia siguiente                        y guardar las predicciones en nuestra base de datos.

2. datos-antiguos:

  Scripts desarrollados en Python destinados a la descarga y posterior procesado de los datos historicos de contaminacion, meteorologia y trafico para su guardado en base de datos y utilizacion para el modelo multivariante.
  
    datos_meteo.py : Descarga, procesa y guarda los datos de meteorologia.
    download_data_contaminacion.py : Descarga los datos de contaminacion.
    recoleccion_datos_contaminacion.py : Procesa y guarda los datos de contaminación.
    
3. grafana:

  Scripts necesarios para el despliegue de Deployment, Services y PersistentVolumeClaim de Kubernetes con una imagen actualizada de Grafana.
  
    grafana.ini : Fichero de configuracion de grafana necesario para ser accesible desde el buscador.
    grafana.yml : Script de despliegue del deployment de grafana con todos sus modulos.
    
    
4. influxdb1.8:

  Scripts necesarios para el despliegue de Deployment, Services, PersistentVolumeClaim, ConfigMap y Secretos de Kubernetes con una imagen de la version 1.8 de inlfuxDB.
  
    influxdb.yml: Script de despliegue del deployment de influxdb 1.8.
    influxdb-config.yml: Script de despliegue de los ficheros de configuracion necesarios de influxdb 1.8.
    influxdb-data.yml: Script de despliegue del PersistentVolumeClaim de influxdb 1.8 para que los datos sean persistentes.
    influxdb-secrets.yml: Script de despliegue del Secrets de influxdb 1.8 para que los datos de Login del usuario no queden guardados en el cluster sin encriptar.
    influx-lb.yml: Script de despliegue del Service de influxdb 1.8 para el deployment sea accesible desde el exterior.
  
5. investigacion_modelo:

  Investigacion realizada sobre la estacion de control de Moratalaz para realizar un modelo multivariante de Prophet basado en datos historicos de contaminacion, meteorologia y trafico.
  
    modelo-multivariante.ipynib: Nootebook de python en el que se han desarrollado las investigaciones pertinentes a la hora del desarrollo del modelo.
    
 6. web-server:

  Scripts utilizados para el desarrollo de la interfaz web ademas de su implementacion en un servidor http.
 
    web/ : Carpeta en la que se encuentra la interfaz web desarrollada en flask ademas de un Dockerfile utilizado para crear la imagen de Docker.
    build_and_push.sh, create_all.sh, delete_all.sh : Scripts desarrollados para ayudar a la hora del despliegue de las aplicaciones en el cluster de kubernetes.
    deployment.yaml : Script de despliegue del deployment de flask, gunicorn y nginx.
    influxdb-config.yml: Script de despliegue de los ficheros de configuracion necesarios de flask, gunicorn y nginx.
    service-dashboard.yml: cript de despliegue del Service de nginx para el deployment sea accesible desde el exterior.
    
    
