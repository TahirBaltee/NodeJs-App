pipeline {
    agent any

    environment {
        IMAGE_NAME = "nodejs-app"
        CONTAINER_NAME = "my-node-container"
        APP_PORT = "3000"
        REPO_URL = "https://github.com/TahirBaltee/NodeJs-App.git"
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    sh 'rm -rf NodeJs-App || true'  // Remove old repo if exists
                    sh 'git clone ${REPO_URL} NodeJs-App'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'cd NodeJs-App && docker build -t ${IMAGE_NAME} .'
                }
            }
        }

        stage('Stop & Remove Existing Container') {
            steps {
                script {
                    // 🔹 Force stop the container (ignores errors if not running)
                    sh 'docker stop ${CONTAINER_NAME} || true'
                    
                    // 🔹 Force remove the container (ignores errors if not present)
                    sh 'docker rm -f ${CONTAINER_NAME} || true'
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    sh 'docker run -d -p ${APP_PORT}:${APP_PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}'
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
