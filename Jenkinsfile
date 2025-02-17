pipeline {
    agent any

    environment {
        IMAGE_NAME = "nodejs-app"
        CONTAINER_NAME = "my-node-container"
        APP_PORT = "3000"
        REPO_DIR = "NodeJs-App"
        REPO_URL = "https://github.com/TahirBaltee/NodeJs-App.git"
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    sh "rm -rf ${REPO_DIR} || true"
                    sh "git clone ${REPO_URL} ${REPO_DIR}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "cd ${REPO_DIR} && docker build -t ${IMAGE_NAME} ."
                }
            }
        }

        stage('Stop & Remove Existing Container') {
            steps {
                script {
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    sh "docker run -d -p ${APP_PORT}:${APP_PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}"
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}
