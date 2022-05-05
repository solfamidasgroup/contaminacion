const marcadores = [];
var map = null;
var Mymarcador = ""

function prueba(){
    console.log("aqui si va")
}
function setCenter() {
    console.log("??????")
    var x = document.getElementById("mySelect").value;
    var lat = x.split(",")[0];
    var lon = x.split(",")[1]
    map.getView().setCenter(ol.proj.fromLonLat([lat,lon]))
}

function marcador(num, num2, map, id){
    let marcador = new ol.Feature({
        geometry: new ol.geom.Point(
            ol.proj.fromLonLat([num, num2])// En dónde se va a ubicar
        ),
        name: id
    });
    
    // Agregamos icono
    marcador.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
            //src: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
            src: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ficons.iconarchive.com%2Ficons%2Ficons-land%2Fvista-map-markers%2F24%2FMap-Marker-Marker-Outside-Chartreuse-icon.png&f=1&nofb=1"
        })
    }));
    
    // marcadores debe ser un arreglo
     // Arreglo para que se puedan agregar otros más tarde
    
    marcadores.push(marcador);// Agregamos el marcador al arreglo
    
    let capa = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: marcadores, // A la capa le ponemos los marcadores
        }),
    });
    // Y agregamos la capa al mapa
    map.addLayer(capa);

}

window.onload = init;

function init(){
        map = new ol.Map({
        target: 'map',
        layers: [          
        new ol.layer.Tile({
        source: new ol.source.OSM()
        }) ],
        view: new ol.View({
        center: ol.proj.fromLonLat([-3.70256, 40.4165]),
        zoom: 14,
        minZoom: 9
        })
    });


    marcador(-3.645188468760171, 40.40734017634128, map, "Moratalaz")
    marcador(-3.6761987560728127, 40.45168278144652, map, "Avenida de Ramón y cajal")
    marcador(-3.6562633869433534, 40.45605946495249, map, "Arturo Soria")
    marcador(-3.6821460868480123, 40.42156141616667, map, "Escuelas Aguirre")
    marcador(-3.708722474166383, 40.34529667620802, map, "Villaverde Alto")
    marcador(-3.7319509478965665, 40.39481170367441,map, "Calle farolillo")
    marcador(-3.751799319906681, 40.427498755086646, map, "Casa campo")
    marcador(-3.579862755897389, 40.475558685407606, map, "Barajas")
    marcador(-3.703339649738877, 40.419073506885724, map, "Plaza del carmen")
    marcador(-3.7039555531365314, 40.44680140003109, map, "Cuatro caminos")
    marcador(-3.703512831213948, 40.47719376378018, map, "Barrio del Pilar")
    marcador(-3.645812943134879, 40.385886454535324, map, "Vallecas")
    marcador(-3.6801361842686267, 40.39577269381513, map, "Mendez Álvaro")
    marcador(-3.6913347375357617, 40.44420437765109, map, "Paseo de la Castellana")
    marcador(-3.5993893265519334, 40.36742642602681, map, "Ensanche de Vallecas")
    marcador(-3.6837827935865914, 40.41635532271863, map, "Retiro")
    marcador(-3.6896253016357257, 40.46650382249919, map, "Plaza Castilla")
    marcador(-3.619418918190188, 40.438809119961746, map, "Urbanización Embajada")
    marcador(-3.7178447452229615, 40.385439851509744, map, "Plaza elíptica")
    marcador(-3.655976227087789, 40.493605540097775, map, "Sanchinarro")
    marcador(-3.7785583651275165, 40.52282292675321, map, "El pardo")
    marcador(-3.6058786625162527, 40.46200032364473, map, "Parque Juan Carlos I")
    marcador(-3.694657195402038, 40.50097926776118, map, "Tres Olivos")


    map.on('click', function(evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
            console.log("hola")
            return feature;
        });
        
        if (feature) {
            Mymarcador = feature.A.name
            //Aqui se llama a la función para pintar los gráficos

            grafico(feature.A.name, "24") // El por defecto. llama a horas


            
            //Ejemplo de peticion
            fetch('http://127.0.0.1:5000/marcador')
            .then(function(response) {
                return response.json();
                //return response.text(); -> Si no es json
            }).then(function(data) {
              console.log(data); // this will be a string
            });

        }else {
            console.log(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'))
            document.getElementById('menu').style.display="none"
        }
    });

    
    map.on('pointermove', function (evt) {
        let feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature;
        });
        
        if (feature) {
            var ident = document.getElementById('ident')
            ident.innerHTML = feature.A.name
        } 
      });
}

function elegir(){
    var op = document.getElementById("op").value;
    grafico(Mymarcador, op)
}

function grafico(n, op){
    var estacion_nombre = document.getElementById('estacion_nombre')

    estacion_nombre.innerHTML = n

    if(n === "Casa campo"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=6" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&from=1648999117174&to=1651591117174&panelId=6" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059374463&to=1651595374463&panelId=6" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Escuelas Aguirre"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=10" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649000538024&to=1651592538024&panelId=10" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059472149&to=1651595472149&panelId=10" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Arturo Soria"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=12" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649000967515&to=1651592967515&panelId=12" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059506276&to=1651595506276&panelId=12" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Avenida de Ramón y cajal"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=8" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649000997126&to=1651592997126&panelId=8" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059576687&to=1651595576687&panelId=8" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
        
    }else if(n === "Moratalaz"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=22" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001024395&to=1651593024396&panelId=22" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059622397&to=1651595622397&panelId=22" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "model"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/gzObXH_7k/modelo?orgId=1&from=1651615200000&to=1651701599000&panelId=2" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Villaverde Alto"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=14" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001064877&to=1651593064877&panelId=14" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059649054&to=1651595649054&panelId=14" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Calle farolillo"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=16" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001108495&to=1651593108495&panelId=16" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059668309&to=1651595668309&panelId=16" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Barajas"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=18" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001133937&to=1651593133937&panelId=18" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059688716&to=1651595688716&panelId=18" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Plaza del carmen"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=20" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001157183&to=1651593157183&panelId=20" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059711377&to=1651595711377&panelId=20" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Cuatro caminos"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=24" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001181761&to=1651593181761&panelId=24" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059757373&to=1651595757373&panelId=24" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Barrio del Pilar"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=26" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001209095&to=1651593209095&panelId=26" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059788729&to=1651595788730&panelId=26" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Vallecas"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=28" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001270251&to=1651593270251&panelId=28" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059813681&to=1651595813681&panelId=28" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Mendez Álvaro"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=30" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001288866&to=1651593288867&panelId=30" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059843040&to=1651595843040&panelId=30" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Paseo de la Castellana"){
       //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/new-dashboard?orgId=1&refresh=5m&from=1651418951669&to=1651505351669&panelId=6" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001312408&to=1651593312408&panelId=32" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059878028&to=1651595878028&panelId=32" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Ensanche de Vallecas"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=38" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001367714&to=1651593367714&panelId=38" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059907321&to=1651595907321&panelId=38" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Retiro"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=34" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001419620&to=1651593419620&panelId=34" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059930814&to=1651595930815&panelId=34" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Plaza Castilla"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=36" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001449529&to=1651593449529&panelId=36" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620059998777&to=1651595998777&panelId=36" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Urbanización Embajada"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=40" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001476562&to=1651593476562&panelId=40" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620060044755&to=1651596044755&panelId=40" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Plaza elíptica"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=42" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001495907&to=1651593495907&panelId=42" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620060082668&to=1651596082668&panelId=42" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Sanchinarro"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=46" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001515739&to=1651593515739&panelId=46" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620060101241&to=1651596101241&panelId=46" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "El pardo"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=48" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001669520&to=1651593669520&panelId=48" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620060122728&to=1651596122728&panelId=48" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Parque Juan Carlos I"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=50" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001687728&to=1651593687728&panelId=50" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&refresh=5m&from=1620060145879&to=1651596145879&panelId=50" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }else if(n === "Tres Olivos"){
        //Creamos las variables con el valor del menu para que pase de hidden a visible
        //Creamos la variable del div en el que se van a incrustar las graficas
        var menu = document.getElementById('menu')
        var menu2 = document.getElementById('menudiv')
        //Se limpia el contenido del div para que no se repitan elementos y se actualice
        menu2.innerHTML = ""

        //Creamos el div
        var div = document.createElement("div");
        //Menu ahora es visible con la opcion block
        menu.style.display = "block"

        //Las opciones del select. Por defecto en el marcador si clickamos será la de ultimas 24 horas
        if(op === "24"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/oM0ljM_nk/datos-tiempo-real?orgId=1&refresh=5m&panelId=52" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "month"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/j8I0OS_nk/datos-ultimo-mes?orgId=1&refresh=5m&from=1649001705665&to=1651593705665&panelId=52" width="600" height="300" frameborder="0"></iframe>'
        }else if(op === "year"){
            div.innerHTML = '<iframe src="http://afbc71ffd7aeb424da532f30de28c636-1611075158.eu-central-1.elb.amazonaws.com:3000/d-solo/UNGWGN_nz/datos-ultimo-anio?orgId=1&from=1620060315479&to=1651596315479&panelId=52" width="600" height="300" frameborder="0"></iframe>'
        }
       
        //Append al padre para que nos muestre la grafica.
        menu2.appendChild(div)
    }
}