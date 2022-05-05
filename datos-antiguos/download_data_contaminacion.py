import requests
import zipfile
import os

i = 0

urls=['https://datos.madrid.es/datosabiertos/MEDIOAMBIENTE/CALIDAD_DEL_AIRE/2021/12/Anio202112.zip',
      'https://datos.madrid.es/datosabiertos/MEDIOAMBIENTE/CALIDAD_DEL_AIRE/2020/12/Anio202012.zip',
      'https://datos.madrid.es/datosabiertos/MEDIOAMBIENTE/CALIDAD_DEL_AIRE/2019/12/Anio201912.zip',
      'https://datos.madrid.es/datosabiertos/MEDIOAMBIENTE/CALIDAD_DEL_AIRE/2022/03/Anio202203.zip']

for url in urls:
    
    r = requests.get(url)

    with open('data' + str(i) + '.zip', 'wb') as f:
        f.write(r.content)
       
    with zipfile.ZipFile('data' + str(i) + '.zip', 'r') as zipObj:
       zipObj.extractall('data')
              
    i = i + 1
    

dir_name = "./data"
test = os.listdir(dir_name)

for item in test:
    if not item.endswith(".csv"):
        os.remove(os.path.join(dir_name, item))
