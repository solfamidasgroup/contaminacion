import requests
from datetime import datetime
from time import sleep
from pytz import timezone
import pandas as pd
from influxdb import InfluxDBClient, DataFrameClient


def getTimestamp(time):
    time_str = str(time.year) + "-" + "{:02d}".format(time.month) + "-" + "{:02d}".format(
        time.day) + "T" + "{:02d}".format((time.hour) - 1) + ":59:59Z"

    return time_str


magnitudes = {
    '8': [1, 6, 7, 8, 9, 10, 12, 14, 20, 30, 35],
    '11': [7, 8, 12, 20, 30, 35],
    '16': [7, 8, 12, 14],
    '17': [7, 8, 12, 14],
    '18': [6, 7, 8, 10, 12, 14, 20, 30, 35],
    '24': [7, 8, 9, 10, 12, 14, 20, 30, 35],
    '27': [7, 8, 12, 14],
    '35': [1, 6, 7, 8, 12, 14],
    '36': [1, 7, 8, 10, 12],
    '38': [7, 8, 9, 10, 12, 20, 30, 35],
    '39': [7, 8, 12, 14],
    '40': [7, 8, 10, 12],
    '47': [7, 8, 9, 10, 12],
    '48': [7, 8, 9, 10, 12],
    '49': [7, 8, 12, 14],
    '50': [7, 8, 9, 10, 12],
    '54': [7, 8, 12, 14],
    '55': [7, 8, 10, 12, 20, 30, 35],
    '56': [6, 7, 8, 12],
    '57': [1, 7, 8, 10, 12],
    '58': [7, 8, 12, 14],
    '59': [7, 8, 12, 14],
    '60': [7, 8, 10, 12, 14]

}

estacion = [8, 11, 16, 17, 18, 24, 27, 35, 36, 38, 39, 40, 47, 48, 49, 50, 54, 55, 56, 57, 58, 59, 60]

estaciones = {
    '8': "escuelas_aguirre",
    '11': "avenida_ramon_cajal",
    '16': "arturo_soria",
    '17': "villaverde_alto",
    '18': "calle_farolillo",
    '24': "casa_campo",
    '27': "barajas",
    '35': "plaza_del_carmen",
    '36': "moratalaz",
    '38': "cuatro_caminos",
    '39': "barrio_pilar",
    '40': "vallecas",
    '47': "mendez_alvaro",
    '48': "paseo_castellana",
    '49': "retiro",
    '50': "plaza_castilla",
    '54': "ensanche_vallecas",
    '55': "urbanizacion_embajada",
    '56': "plaza_eliptica",
    '57': "sanchinarro",
    '58': "el_pardo",
    '59': "parque_juan_carlos_i",
    '60': "tres_olivos"
}

r = requests.get("https://www.mambiente.madrid.es/opendata/horario.csv")

with open('./horario.csv', 'wb') as f:
    f.write(r.content)
    data = r.content

for est in estacion:

    df_list = []

    cet = timezone('CET')
    time = datetime.now(cet)

    timestamp = getTimestamp(time)

    df1 = pd.read_csv('./horario.csv', sep=';')

    data_estacion = df1[df1.ESTACION == est]

    mags = magnitudes[str(est)]

    data = {
        'time': timestamp,
    }

    if time.hour == 0:
        hour = 24
    else:
        hour = time.hour

    # MAGNITUD 1 = Dioxido de azufre

    if 1 in mags:
        data['dioxido_azufre'] = data_estacion[data_estacion.MAGNITUD == 1]["H" + "{0:0=2d}".format(hour)].iloc[0]

    # MAGNITUD 6 = MonÃ³xido de Carbono

    if 6 in mags:
        data['monoxido_carbono'] = data_estacion[data_estacion.MAGNITUD == 6]["H" + "{0:0=2d}".format(hour)].iloc[
            0]

    # MAGNITUD 7 = MonÃ³xido de NitrÃ³geno

    if 7 in mags:
        data['monoxido_nitrogeno'] = \
        data_estacion[data_estacion.MAGNITUD == 7]["H" + "{0:0=2d}".format(hour)].iloc[0]

    # MAGNITUD 8 = DiÃ³xido de NitrÃ³geno

    if 8 in mags:
        data['dioxido_nitrogeno'] = data_estacion[data_estacion.MAGNITUD == 8]["H" + "{0:0=2d}".format(hour)].iloc[
            0]

    # MAGNITUD 9 = PartÃ­culas < 2.5 Âµm

    if 9 in mags:
        data['particulas_2_5'] = data_estacion[data_estacion.MAGNITUD == 9]["H" + "{0:0=2d}".format(hour)].iloc[0]

    # MAGNITUD 10 = PartÃ­culas < 10 Âµm

    if 10 in mags:
        data['particulas_10'] = data_estacion[data_estacion.MAGNITUD == 10]["H" + "{0:0=2d}".format(hour)].iloc[0]

    # MAGNITUD 12 = Ã“xidos de NitrÃ³geno

    if 12 in mags:
        data['oxidos_nitrogeno'] = data_estacion[data_estacion.MAGNITUD == 12]["H" + "{0:0=2d}".format(hour)].iloc[
            0]

    # MAGNITUD 14 = Ozono

    if 14 in mags:
        data['ozono'] = data_estacion[data_estacion.MAGNITUD == 14]["H" + "{0:0=2d}".format(hour)].iloc[0]

    # MAGNITUD 20 = Tolueno

    if 20 in mags:
        data['tolueno'] = data_estacion[data_estacion.MAGNITUD == 20]["H" + "{0:0=2d}".format(hour)].iloc[0]

    # MAGNITUD 30 = Benceno

    if 30 in mags:
        data['benceno'] = data_estacion[data_estacion.MAGNITUD == 30]["H" + "{0:0=2d}".format(hour)].iloc[0]

    # MAGNITUD 35 = Etilbenceno

    if 35 in mags:
        data['etilbenceno'] = data_estacion[data_estacion.MAGNITUD == 35]["H" + "{0:0=2d}".format(hour)].iloc[0]

    data['tag'] = str(time.year) + str(time.month) + str(time.day) + str(est)

    df = pd.DataFrame([data])

    df['time'] = pd.to_datetime(df['time'])

    df.set_index('time', inplace=True)

    print(estaciones[str(est)])
    print(df)

    client = DataFrameClient('54.235.62.17', 8086, 'admin', 'password', 'tfg')

    db = "horario_" + estaciones[str(est)]

    client.write_points(df, db, tag_columns=['tag'], protocol='line')
