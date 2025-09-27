# ***Project Charter \- ELIO***

## **1\. Objetivos del Proyecto**

### Propósito

Elio es una herramienta que permite que las consultas médicas sean registradas de una manera más asequible, cómoda y eficiente. Automatiza la creación de los informes de diagnóstico clínico para que los médicos no tengan que escribir todo desde cero.  
Esto ahorrará tiempo, generará un registro más ordenado y con la posibilidad a posteriori de tener la capacidad de realizar muestras estadísticas de casos, patologías y procedimientos clínicos.

### Objetivos SMART

1. Desarrollar una aplicación web funcional que genere plantillas médicas personaliza  
   \-das basándose en tres parámetros: sexo, edad y motivo de la consulta.   
2. Conectar Elio con SNOMED CT.  
   

## **2\. Stakeholders y Roles**

### Stakeholders Internos

\- Equipo de trabajo  
\- Staff docente de Holberton UY

### Stakeholders Externos

\- Cliente  
\- Asistencial Médica de Maldonado

### Roles del Equipo

| *Rol* | *Responsabilidades* | *Asignado a* |
| :---: | :---- | :---: |
| ***Design Lead*** | Front-End | *Fernando Falcón* |
| ***Engineering Lead*** | Back-End | *Bruno Barrera* |
| ***Project Manager*** | Planificar, organizar, ejecutar y supervisar, liderar equipo, comunicar avances y asegurar la calidad de los entregables | *Alejandro Arévalo* |

## **3\. Alcance del Proyecto**

### Dentro del Alcance

\- Integración de APIs

\- Desarrollo del Back-End:

# 

# ***Flujo Backend***

## *Punto de inicio: AppEOn*

La persona usuaria (PU) accede a Elio desde AppEOn a través de un enlace.

AppEOn envía al backend de Elio un payload inicial con los siguientes datos anonimizados:

- Edad

  - Sexo

Durante la etapa de desarrollo estos datos serán sintéticos.

*Implicancias backend:*

* El backend de Elio valida la integridad y formato del payload recibido.

* Se asegura que el ID de sesión o token correspondiente a una PU autenticada en AppEOn.

* No se almacena información personal identificable en esta etapa.

## *Punto de inicio: Elio*

* Al momento del acceso, el back-end expone un endpoint de inicio que recibe los datos desde AppEOn y genera un contexto de sesión con:

  - Edad (sólo lectura)

  - Sexo (sólo lectura)

  - Identificador único de sesión (UUID o token temporal)

Este contexto se mantiene en memoria o en almacenamiento transitorio para persistir entre pasos de la interacción.

## *Ingreso de datos: Motivo de consulta*

* El backend recibe del frontend el campo Motivo de consulta ingresado por la PU.

* Validaciones backend:

  - No vacío.

  - No compuesto solo por espacios.

* El backend envía este input al motor de sugerencias (modelo LLM o servicio asociado).

*Posible optimización:*

* Elio puede discriminar dónde buscar las posibles respuestas basándose en Edad y Sexo.  
* Se puede disparar una búsqueda en paralelo antes incluso de que la PU ingrese datos, mejorando la percepción de rendimiento.

## *Generación de sugerencias:*

* El backend procesa la entrada y consulta al motor de IA.

* La IA devuelve sugerencias agrupadas (ejemplo: lateralidad, tipo de dolor, localización).

* El backend normaliza estas respuestas en formato JSON y las devuelve al frontend.

## *Borrador:*

* Una vez confirmados los inputs, el frontend solicita al backend la generación de borrador clínico.

* El backend compone un prompt estructurado con:

  - Motivo de consulta

  - Datos básicos (edad, sexo)

  - Sugerencias seleccionadas por la PU/IA

* El backend recibe del motor de IA un borrador clínico segmentado en grupos (ej.: antecedentes, alergias, medicación, signos vitales).

* El backend entrega esta información al frontend ya fragmentada para su edición.

## *Implicancias backend:*

El backend actúa como middleware entre AppEOn, el motor de IA y la HCE.  
Debe garantizar:

* Integridad de datos.

* Seguridad en tránsito (TLS).

* Trazabilidad (logs de request/response).

## *Cierre de sesión:*

* Una vez completada la operación, el backend invalida el contexto de sesión.

* El control retorna a AppEOn y la PU continúa trabajando en la HCE de origen.

\- Desarrollo de Front-End:

***Flujo de usuario:***

# 

# *Punto de inicio: AppEOn*

La persona usuaria (PU de aquí en más) ingresa a Elio desde un enlace en AppEOn.

Implicancias:

* La PU ya tiene asignada su identidad en el sistema.

* La PU ya tiene asignados sus permisos en el sistema.


El ingreso a Elio se hará desde una historia clínica preexistente, desde AppEOn se enviarán los datos anonimizados, Edad y Sexo presentes en la historia clínica al momento de iniciar Elio, durante la etapa de desarrollo estos datos serán sintéticos.

# 

# *Punto de inicio: Elio*

Al ingresar a Elio la PU accederá a 3 campos:

* Edad (Sólo lectura)

* Sexo (Sólo lectura)

* Motivo de consulta (Ingreso de texto)


*Posible optimización:*

Elio puede discriminar dónde buscar las posibles respuestas de antemano basándose en los datos Edad y Sexo, se puede disparar una búsqueda en paralelo (prefetch) desde antes incluso que la PU ingrese dato alguno otorgando una mejora en la percepción de rendimiento.

## *Ingreso de datos (Campo Motivo de consulta):*

El campo Motivo de consulta no podrá ser vacío o componerse solamente de espacios.

A medida que la PU ingrese datos, Elio proveerá sugerencias para completar la plantilla a generar.

La PU podrá descartar todo el grupo de sugerencias en caso de no ser relevante. Las sugerencias deberán ser activadas (seleccionadas) para formar parte de la información que será enviada al generador de borradores.

Una vez la PU haya finalizado con el ingreso de información en el campo Motivo de consulta podrá optar por la opción Generar borrador.

# 

# *Borrador:*

La PU accedera a una serie de grupos de información generados por el asistente.

Esta información será mostrada en grupos de modo de evitar la edición de grandes campos de texto y mantener a la PU enfocada en su tarea actual.

La PU podrá editar los distintos grupos, ya sea agregando información en formato libre, o completando campos.

Una vez la PU haya finalizado con la edición del borrador podrá optar por la opción Guardar en HCE.

Luego de enviados los datos Elio se cerrará y la PU volverá a la HCE desde la cual ingresó a Elio 

### Fuera del Alcance

\- Integración con la plataforma AppEon

## **4\. Riesgos y Mitigación**

| Riesgo | Impacto | Estrategia de Mitigación |
| :---: | :---: | :---: |
| ***Falta de conocimiento técnico en tecnologías*** | Alto | Capacitación continua y documentación detallada |
| ***Falla en la comunicación respecto de las necesidades del cliente*** | Alto | Reuniones frecuentes con el cliente |
| ***Retrasos en el cronograma de desarrollo*** | Medio | Planificación con metas de tiempo, reuniones semanales |
| ***Problemas a la hora de conectar Back-End y Front-End*** | Alto | Testear de forma continua |
| ***Problemas de rendimiento de la App*** | Medio | Testear de forma continua |

## **5\. Plan de Alto Nivel**

| Etapas | Fechas | Hitos/Entregables |
| ----- | ----- | ----- |
| ***Etapa 1: Desarrollo de ideas*** | 31/08/2025 | **Completado** |
| ***Etapa 2: Desarrollo del Project Charter*** | 14/09/2025 | **En proceso** |
| ***Etapa 3: Documentación Técnica*** |  | **A entregar** |
| ***Etapa 4: Desarrollo del MVP*** |  | **A entregar** |
| ***Etapa 5: Cierre del Proyecto*** |  | **A entregar** |

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## Fecha: 11/09/2025

## Equipo: 

* ## Falcón, Fernando;

* ## Barrera, Bruno

* ## Arévalo, Alejandro

