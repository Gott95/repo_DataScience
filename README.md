# 📊 ChurnInsight - Predicción de Retención de Clientes

![Status](https://img.shields.io/badge/Status-En%20Desarrollo-green)
![Python](https://img.shields.io/badge/Data%20Science-Python-3776AB?logo=python&logoColor=white)
![Java](https://img.shields.io/badge/Backend-Java-ED8B00?logo=openjdk&logoColor=white)
![Vaadin](https://img.shields.io/badge/Frontend-Vaadin-00B4F0?logo=vaadin&logoColor=white)
![Postgres](https://img.shields.io/badge/Database-PostgreSQL-316192?logo=postgresql&logoColor=white)

> **Una solución integral para analizar, predecir y reducir la tasa de abandono de clientes (Churn Rate) mediante Inteligencia Artificial, soportada por una arquitectura robusta y escalable.**

---

## 👥 Equipo de Desarrollo

Este proyecto fue desarrollado con orgullo por **H12-25-L-Equipo 11-Data Science** como parte de la iniciativa **One Oracle / Alura Latam**.

## 🚀 Acerca del Proyecto

**ChurnInsight** combina el poder del análisis de datos con una interfaz de usuario intuitiva para ayudar a las empresas a identificar clientes en riesgo.

### Características Principales
* **Modelo Predictivo:** Algoritmos de Machine Learning (Python) entrenados para detectar patrones de abandono.
* **Gestión de Datos:** Almacenamiento seguro y relacional de información de clientes mediante PostgreSQL.
* **Dashboard Interactivo:** Interfaz web (Vaadin + Java) para visualizar métricas y gestionar predicciones en tiempo real.

---

## 🛠️ Tecnologías Utilizadas

El proyecto sigue una arquitectura híbrida moderna:

### 🗄️ Base de Datos
* **Motor:** PostgreSQL 14+
* **ORM:** Hibernate / JPA (Manejo de persistencia desde Java).

### ☕ Aplicación Web (Full Stack)
* **Backend:** Java (Spring Boot).
* **Frontend:** Vaadin Flow.
* **Build Tool:** Maven.

### 🐍 Data Science (IA & Análisis)
* **Lenguaje:** Python 3.x.
* **Librerías:** Pandas, Scikit-learn, SQLAlchemy (conexión a DB).
* **Entregables:** Notebooks de Jupyter y modelos serializados.

---

## 📂 Estructura del Repositorio

```text
repo_DataScience/
├── app/                  # Código fuente de la Aplicación Web (Java/Vaadin)
│   ├── src/main/resources/application.properties  # Configuración de DB
│   └── pom.xml           # Dependencias Maven
├── notebooks/            # Jupyter Notebooks
├── scripts/              # Scripts SQL de inicialización (si aplica)
├── data/                 # Datasets raw (Ignorados por git si son sensibles)
├── requirements.txt      # Dependencias de Python
└── README.md             # Documentación del proyecto

