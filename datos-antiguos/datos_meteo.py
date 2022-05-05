import os
import pandas as pd
from influxdb import InfluxDBClient, DataFrameClient

urls = ['https://datos.madrid.es/egob/catalogo/300352-112-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-109-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-106-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-103-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-100-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-97-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-94-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-91-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-88-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-85-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-82-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-79-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-76-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-73-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-70-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-67-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-63-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-60-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-57-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-54-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-51-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-48-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-45-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-42-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-39-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-36-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-33-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-30-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-27-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-24-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-21-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-18-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-15-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-12-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-0-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-3-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-6-meteorologicos-horarios.csv',
        'https://datos.madrid.es/egob/catalogo/300352-9-meteorologicos-horarios.csv']

meses = ['febrero_2022', 'enero_2022', 'diciembre_2021', 'noviembre_2021', 'octubre_2021', 'septiembre_2021',
         'agosto_2021',
         'julio_2021', 'junio_2021', 'mayo_2021', 'abril_2021', 'marzo_2021', 'febrero_2021', 'enero_2021',
         'diciembre_2020', 'noviembre_2020', 'octubre_2020', 'septiembre_2020', 'agosto_2020',
         'julio_2020', 'junio_2020', 'mayo_2020', 'abril_2020', 'marzo_2020', 'febrero_2020', 'enero_2020',
         'diciembre_2019', 'noviembre_2019', 'octubre_2019', 'septiembre_2019', 'agosto_2019',
         'julio_2019', 'junio_2019', 'mayo_2019', 'abril_2019', 'marzo_2019', 'febrero_2019', 'enero_2019']

import requests
import zipfile

for i in range(37):
    r = requests.get(urls[i])
    with open('/home/erik/data_meteo/' + meses[i] + '.csv', 'wb') as f:
        f.write(r.content)


def iter_data(data_list):
    final_list = []
    for index, row in data_list.iterrows():
        for x in range(8, 56, 2):
            final_list.append(row[x])
    return final_list


df_list = []

for file in os.listdir('/home/erik/data_meteo'):
    if not file.endswith(".csv"):
        continue
    df1 = pd.read_csv('/home/erik/data_meteo/' + file, sep=';')
    data_moratalaz = df1[df1.ESTACION == 102]

    dias = data_moratalaz["DIA"].unique()
    mes = data_moratalaz["MES"].unique()
    ano = data_moratalaz["ANO"].unique()

    timestamps = []
    tags = []

    for day in dias:
        for i in range(24):
            time_str = str(ano[0]) + "-" + "{:02d}".format(mes[0]) + "-" + "{:02d}".format(day) + "T" + "{:02d}".format(
                i) + ":59:59Z"
            timestamps.append(time_str)
            tags.append(file + str(day) + str(i))

    # MAGNITUD 81 = Velocidad del viento

    velocidad_viento_data = data_moratalaz[data_moratalaz["MAGNITUD"] == 81]

    velocidad_viento = iter_data(velocidad_viento_data)

    # MAGNITUD 82 = Direccion del viento

    direccion_viento_data = data_moratalaz[data_moratalaz["MAGNITUD"] == 82]

    direccion_viento = iter_data(direccion_viento_data)

    # MAGNITUD 83 = Temperatura

    temperatura_data = data_moratalaz[data_moratalaz["MAGNITUD"] == 83]

    temperatura = iter_data(temperatura_data)

    # MAGNITUD 86 = Humedad relativa

    humedad_relativa_data = data_moratalaz[data_moratalaz["MAGNITUD"] == 86]

    humedad_relativa = iter_data(humedad_relativa_data)

    # MAGNITUD 87 = Presion barometrica

    presion_barometrica_data = data_moratalaz[data_moratalaz["MAGNITUD"] == 87]

    presion_barometrica = iter_data(presion_barometrica_data)

    # MAGNITUD 88 = Radiacion solar

    radiacion_solar_data = data_moratalaz[data_moratalaz["MAGNITUD"] == 88]

    radiacion_solar = iter_data(radiacion_solar_data)

    # MAGNITUD 89 = Precipitacion

    precipitacion_data = data_moratalaz[data_moratalaz["MAGNITUD"] == 89]

    precipitacion = iter_data(precipitacion_data)

    print(len(timestamps))
    print(len(velocidad_viento))

    df = pd.DataFrame(
        {'time': timestamps,
         'velocidad_viento': velocidad_viento,
         'direccion_viento': direccion_viento,
         'temperatura': temperatura,
         'humedad_relativa': humedad_relativa,
         'presion_barometrica': presion_barometrica,
         'radiacion_solar': radiacion_solar,
         'precipitacion': precipitacion,
         'tag': tags

         }
    )

    df_list.append(df)

final_df = pd.concat(df_list)

final_df['time'] = pd.to_datetime(final_df['time'])

final_df.set_index('time', inplace=True)

print(final_df.index)

client = DataFrameClient('52.152.171.129', 8086, 'admin', 'password', 'tfg')

client.write_points(final_df, "datos_contaminacion", tag_columns=['tag'], protocol='line')

print(final_df)