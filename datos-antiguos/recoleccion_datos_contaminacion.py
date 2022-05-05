import requests, zipfile
import os
from io import StringIO
import pandas as pd
import datetime
from influxdb import InfluxDBClient, DataFrameClient

df_list = [] 

def iter_data(data_list, max_dia):
    
    final_list = []
    
    dias_df = data_list["DIA"].unique()
    
    dias = range(1, max_dia + 1)
    
    missing = list(set(dias) - set(dias_df))
    
    for day in missing:
        data_list = data_list.append({'PROVINCIA': None,
                                        'MUNICIPIO': None,
                                        'ESTACION': None,
                                        'MAGNITUD': None,
                                        'PUNTO_MUESTREO': None,
                                        'MES': None,
                                        'DIA': day,
                                        'H01': None,
                                        'V01': None,
                                        'H02': None,
                                        'V02': None,
                                        'H03': None,
                                        'V03': None,
                                        'H04': None,
                                        'V04': None,
                                        'H05': None,
                                        'V05': None,
                                        'H06': None,
                                        'V06': None,
                                        'H07': None,
                                        'V07': None,
                                        'H08': None,
                                        'V08': None,
                                        'H09': None,
                                        'V09': None,
                                        'H10': None,
                                        'V10': None,
                                        'H11': None,
                                        'V11': None,
                                        'H12': None,
                                        'V12': None,
                                        'H13': None,
                                        'V13': None,
                                        'H14': None,
                                        'V14': None,
                                        'H15': None,
                                        'V15': None,
                                        'H16': None,
                                        'V16': None,
                                        'H17': None,
                                        'V17': None,
                                        'H18': None,
                                        'V18': None,
                                        'H19': None,
                                        'V19': None,
                                        'H20': None,
                                        'V20': None,
                                        'H21': None,
                                        'V21': None,
                                        'H22': None,
                                        'V22': None,
                                        'H23': None,
                                        'V23': None,
                                        'H24': None,
                                        'V24': None
                                       }, ignore_index=True)

    for index, row in data_list.iterrows():
        for x in range(8, 56, 2):
            final_list.append(row[x])
    return final_list

                
for file in os.listdir('/home/erik/data'):
        
    df1 = pd.read_csv('/home/erik/data/' + file,  sep = ';')
    
    data_moratalaz = df1[df1.ESTACION == 36]

    dias = data_moratalaz["DIA"].unique()
    mes = data_moratalaz["MES"].unique()
    ano = data_moratalaz["ANO"].unique()

    timestamps = []
    tags = []

    for day in dias:
        for i in range(24):
            time_str = str(ano[0]) + "-" + "{:02d}".format(mes[0]) + "-" + "{:02d}".format(day) + "T" + "{:02d}".format(i) + ":59:59Z"

            #time_unix = int(datetime.datetime.strptime(time_str, '%Y-%m-%dT%H:%M:%SZ').strftime("%s")) * 1000000000

            timestamps.append(time_str)

            tags.append(file + str(day) + str(i))
    
    # MAGNITUD 1 = Dioxido de azufre

    dioxido_azufre_data = data_moratalaz[data_moratalaz["MAGNITUD"] == 1]

    dioxido_azufre = iter_data(dioxido_azufre_data, dias[-1])
        
    # MAGNITUD 7 = Monoxido de nitrogeno

    monoxido_nitrogeno_data = data_moratalaz[data_moratalaz["MAGNITUD"] == 7]

    monoxido_nitrogeno = iter_data(monoxido_nitrogeno_data, dias[-1])
   
    # MAGNITUD 8 = Dioxido de nitrogeno

    dioxido_nitrogeno_data = data_moratalaz[data_moratalaz["MAGNITUD"] == 8]

    dioxido_nitrogeno = iter_data(dioxido_nitrogeno_data, dias[-1])
    
    # MAGNITUD 10 = Particulas < 10

    particulas_10_data = data_moratalaz[data_moratalaz["MAGNITUD"] == 10]

    particulas_10 = iter_data(particulas_10_data, dias[-1])
     
    # MAGNITUD 12 = Oxidos de nitrogeno

    oxidos_nitrogeno_data = data_moratalaz[data_moratalaz["MAGNITUD"] == 12]

    oxidos_nitrogeno = iter_data(oxidos_nitrogeno_data, dias[-1])
          
    df = pd.DataFrame(
        {'time': timestamps,
         'dioxido_azufre': dioxido_azufre,
         'monoxido_nitrogeno': monoxido_nitrogeno,
         'dioxido_nitrogeno': dioxido_nitrogeno,
         'particulas_10': particulas_10,
         'oxidos_nitrogeno': oxidos_nitrogeno,
         'tag': tags,

        }
    )

    df_list.append(df) 
    
final_df = pd.concat(df_list)

final_df['time'] = pd.to_datetime(final_df['time'])

#datetime_index = pd.DatetimeIndex(final_df["time"].values)

final_df.set_index('time', inplace = True)

print(final_df)

client = DataFrameClient('localhost', 8086, 'admin', 'password', 'tfg')

client.write_points(final_df, "prueba", tag_columns = ['tag'], protocol = 'line')

