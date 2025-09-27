# ***Project Charter \- ELIO***

## **1\. Project Objectives**

### Purpose

Elio is a tool that enables medical consultations to be recorded in a more accessible, comfortable, and efficient manner. It automates the creation of clinical diagnostic reports so that doctors don't have to write everything from scratch.
This will save time, generate more organized records, and subsequently enable the ability to perform statistical samples of cases, pathologies, and clinical procedures.

### SMART Objectives

1. Develop a functional web application that generates personalized medical templates based on three parameters: gender, age, and reason for consultation.   
2. Connect Elio with SNOMED CT.
   

## **2\. Stakeholders y Roles**

### Internal Stakeholders

\- Work team  
\- Holberton UY teaching staff

### External Stakeholders

\- Client 
\- Asistencial Médica de Maldonado

### Team Roles

| *Role* | *Responsibilities* | *Assigned to* |
| :---: | :---- | :---: |
| ***Design Lead*** | Front-End | *Fernando Falcón* |
| ***Engineering Lead*** | Back-End | *Bruno Barrera* |
| ***Project Manager*** | Planning, organizing, executing and supervising, leading the team, communicating progress and ensuring deliverable quality | *Alejandro Arévalo* |

## **3\. Project Scope**

### Within Scope

\- API Integration
\- Back-End Development

# 

# ***Backend Flow***

## *Starting Point: AppEOn*

The user (PU) accesses Elio from AppEOn through a link.
AppEOn sends an initial payload to Elio's backend with the following anonymized data:

- Age
- Gender

During the development stage, this data will be synthetic.

*Backend implications:*

* Elio's backend validates the integrity and format of the received payload.
* It ensures the session ID or token corresponds to a user authenticated in AppEOn.
* No personally identifiable information is stored at this stage.

## *Starting Point: ELIO*

* Upon access, the back-end exposes a start endpoint that receives data from AppEOn and generates a session context with:

  - Age (read-only)
  - Gender (read-only)
  - Unique session identifier (UUID or temporary token)

This context is maintained in memory or transitory storage to persist between interaction steps.

## *Data Entry: Reason for Consultation*

* The backend receives the Reason for consultation field from the frontend entered by the user.

* Backend validations:

  - Not empty.
  - Not composed of only spaces.

* The backend sends this input to the suggestion engine (LLM model or associated service).

*Possible optimization:*

* Elio can discriminate where to search for possible responses based on Age and Gender.
* A parallel search can be triggered even before the user enters data, improving the perception of performance.

## *Suggestion Generation:*

* The backend processes the input and queries the AI engine.
* The AI returns grouped suggestions (example: laterality, type of pain, location).
* The backend normalizes these responses in JSON format and returns them to the frontend.

## *Draft:*

* Once the inputs are confirmed, the frontend requests the backend to generate a clinical draft.
* The backend composes a structured prompt with:

  - Reason for consultation
  - Basic data (age, gender)
  - Suggestions selected by the user/AI

* The backend receives a clinical draft from the AI engine segmented into groups (e.g.: medical history, allergies, medication, vital signs).
* The backend delivers this information to the frontend already fragmented for editing.

## *Backend Implications:*

The backend acts as middleware between AppEOn, the AI engine, and the EHR. It must guarantee:

* Data integrity.
* Transit security (TLS).
* Traceability (request/response logs).

## *Session Closure:*

* Once the operation is completed, the backend invalidates the session context.
* Control returns to AppEOn and the user continues working on the original EHR.
* Front-End Development:

***User Flow:***

# *Starting Point: AppEOn*

The user (PU from now on) enters Elio from a link in AppEOn.

Implications:

* The PU already has their identity assigned in the system.
* The PU already has their permissions assigned in the system.

Entry to Elio will be from a pre-existing clinical record. AppEOn will send anonymized data, Age and Gender present in the clinical record when starting Elio. During the development stage, this data will be synthetic.


# *Starting Point: ELIO*

Upon entering Elio, the PU will access 3 fields:

* Age (Read-only)
* Gender (Read-only)
* Reason for consultation (Text input)

*Possible optimization:*

Elio can discriminate where to search for possible answers in advance based on Age and Gender data. A parallel search (prefetch) can be triggered even before the PU enters any data, providing an improvement in performance perception.


## *Data Entry (Reason for Consultation Field):*

The Reason for consultation field cannot be empty or composed only of spaces.

As the PU enters data, Elio will provide suggestions to complete the template to be generated.

The PU can discard the entire group of suggestions if not relevant. Suggestions must be activated (selected) to be part of the information that will be sent to the draft generator.

Once the PU has finished entering information in the Reason for consultation field, they can choose the Generate draft option.


# *Draft:*

The PU will access a series of information groups generated by the assistant.

This information will be displayed in groups to avoid editing large text fields and keep the PU focused on their current task.

The PU can edit the different groups, either by adding information in free format or by completing fields.

Once the PU has finished editing the draft, they can choose the Save to EHR option.

After the data is sent, Elio will close and the PU will return to the EHR from which they entered Elio.

### Out of Scope

- Integration with the AppEon platform


## **4\. Risks and Mitigation**

| Risk | Impact | Mitigation Strategy |
| :---: | :---: | :---: |
| ***Lack of technical knowledge in technologies*** | High | Continuous training and detailed documentation |
| ***Failure in communication regarding client needs*** | High | Frequent meetings with the client |
| ***Delays in the development schedule*** | Medium | Planning with time goals, weekly meetings |
| ***Problems connecting Back-End and Front-End*** | High | Continuous testing |
| ***App performance issues*** | Medium | Continuous testing |


## **5\. High-Level Plan**

| Stages | Dates | Milestones/Deliverables |
| ----- | ----- | ----- |
| ***Stage 1: Idea Development*** | 31/08/2025 | **Completed** |
| ***Etapa 2: Stage 2: Project Charter Development*** | 14/09/2025 | **Completed** |
| ***Stage 3: Technical Documentation*** |  | **In process** |
| ***Stage 4: MVP Development*** |  | **To be delivered** |
| ***Stage 5: Project Closure*** |  | **To be delivered** |



## Fecha: 11/09/2025

## Equipo: 

* ### Falcón, Fernando;
* ### Barrera, Bruno
* ### Arévalo, Alejandro

